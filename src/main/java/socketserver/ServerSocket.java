package socketserver;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;

/**
 * @author cetc28
 */
public class ServerSocket {

    public void open() throws IOException {
        ServerSocketChannel serverChannel = ServerSocketChannel.open();
        serverChannel.configureBlocking(false);
        Selector serverSelector = Selector.open();
        serverChannel.socket().bind(new InetSocketAddress(8000));
        SelectionKey key = serverChannel.register(serverSelector, SelectionKey.OP_ACCEPT);

        while (true) {
            int nRead = serverSelector.select();
            Iterator<SelectionKey> keys = serverSelector.selectedKeys().iterator();
            ByteBuffer readBuff = ByteBuffer.allocate(4096);
            ByteBuffer writeBuff = ByteBuffer.allocate(4096);

            while (keys.hasNext()) {
                SelectionKey tmpKey = keys.next();
                keys.remove();
                if (tmpKey.isAcceptable()) {
                    // 创建新的连接，并且把连接注册到selector上，而且，
                    // 声明这个channel只对读操作感兴趣。
                    SocketChannel socketChannel = serverChannel.accept();
                    socketChannel.configureBlocking(false);
                    socketChannel.register(serverSelector, SelectionKey.OP_READ);
                } else if (tmpKey.isReadable()) {
                    SocketChannel socketChannel = (SocketChannel) tmpKey.channel();
                    readBuff.clear();
                    try {
                        socketChannel.read(readBuff);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    readBuff.flip();
                    String res = new String(readBuff.array());
                    System.out.println(res);

                    //向8888端口转发
                    SocketChannel sendChannel = SocketChannel.open();
                    sendChannel.connect(new InetSocketAddress("127.0.0.1",8888));
                    ByteBuffer writeBuffer = ByteBuffer.allocate(4096);
                    ByteBuffer readBuffer = ByteBuffer.allocate(4096);
                    res = res.replace("8000", "8888");
                    writeBuffer.put(res.getBytes());
                    writeBuffer.flip();
//                    writeBuffer.rewind();
                    sendChannel.write(writeBuffer);

                    readBuffer.clear();
                    try {
                        sendChannel.read(readBuffer);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

//                    Socket s = new Socket("localhost", 8888);
//                    OutputStream ops = s.getOutputStream();
//                    InputStream ips = s.getInputStream();
//
//                    ops.write(res.getBytes());
//                    byte[] buffers = new byte[4096];
//                    ips.read(buffers);
//                    System.out.println(new String(buffers));


                    socketChannel.close();
//                    tmpKey.interestOps(SelectionKey.OP_WRITE);
                } else if (tmpKey.isWritable()) {
                    writeBuff.rewind();
                    SocketChannel socketChannel = (SocketChannel) tmpKey.channel();
                    String response = "HTTP/1.1 200 OK\n";
                    writeBuff.put(response.getBytes());
                    writeBuff.flip();
                    socketChannel.write(writeBuff);
//                    tmpKey.interestOps(SelectionKey.OP_READ);
                }
            }
        }
    }


}
