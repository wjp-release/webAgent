package socketserver;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.util.concurrent.ThreadPoolExecutor;

public class Handler implements Runnable {
    private SocketChannel channel;
    private SelectionKey key;
    private ByteBuffer returnBuffer = ByteBuffer.allocate(1024 * 32);
//    static ThreadPoolExecutor executor = new ThreadPoolExecutor(, , , , );

    Handler(SocketChannel channel, Selector selector) {
        this.channel = channel;
        try {
            channel.configureBlocking(false);
            key = channel.register(selector, SelectionKey.OP_READ);
            key.attach(this);
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
        try {
            int i = channel.read(byteBuffer);
            if (i == -1) {
                key.cancel();
                channel.close();
                return;
            }
            //根据读取内容判断是获取html静态资源还是获取


            //向8888端口转发

            new Processer().forward(byteBuffer, returnBuffer);

            key.interestOps(SelectionKey.OP_WRITE);
        } catch (IOException e) {
            try {
                key.cancel();
                channel.close();
            } catch (IOException e1) {
                e1.printStackTrace();
            }
            e.printStackTrace();
        }
    }

    private void write() {
        try {
            channel.write(returnBuffer);
            returnBuffer.clear();
            key.cancel();
            channel.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

}
