package socketserver;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;

public class Handler implements Runnable {
    private SocketChannel channel;
    private SelectionKey key;

    Handler(SocketChannel channel, Selector selector) {
        this.channel = channel;
        try {
            channel.configureBlocking(false);
            key = channel.register(selector, SelectionKey.OP_READ);
            key.attach(this);
//            channel.configureBlocking(false);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public void run() {
        if (key.isReadable()) {
            read();
        } else if (key.isWritable()) {
            write();
        }
    }

    private void read() {
        ByteBuffer byteBuffer = ByteBuffer.allocate(4096);
//        ByteBuffer byteBufferw = ByteBuffer.allocate(40960);
        try {
            System.out.println("out:" +key.channel() == channel +"\r\n"+key.channel().equals(channel));
            int i = channel.read(byteBuffer);
            if(i==-1) {
                key.cancel();
                channel.close();
                return;
            }

            //根据读取内容判断是获取html静态资源还是获取


            //向8888端口转发
            String res = new String(byteBuffer.array());
            SocketChannel newChannel = SocketChannel.open();
            newChannel.connect(new InetSocketAddress("127.0.0.1", 8888));
            ByteBuffer writeBuffer = ByteBuffer.allocate(4096);
            ByteBuffer readBuffer = ByteBuffer.allocate(4096);
//            if(!res.contains("8000")){
////                channel.close();
//                return;
//            }
            res = res.replace("8000", "8888");
            System.out.println(res);
            writeBuffer.put(res.getBytes());
            writeBuffer.flip();
            newChannel.write(writeBuffer);

            readBuffer.clear();
            try {
                newChannel.read(readBuffer);
            } catch (Exception e) {
                e.printStackTrace();
            }
            String response = new String(readBuffer.array());
            System.out.println(response);
            readBuffer.flip();
//            byteBufferw.put(response.getBytes());
//            byteBufferw.flip();
//            channel.configureBlocking(true);
            channel.write(readBuffer);


//        key.interestOps(SelectionKey.OP_WRITE);
//            channel.close();

        } catch (IOException e) {
//            try {
//                channel.close();
//            } catch (IOException e1) {
//                e1.printStackTrace();
//            }
            e.printStackTrace();
        }
    }

    private void write() {


//        key.interestOps(SelectionKey.OP_READ);
    }

}
