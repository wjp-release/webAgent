package socketserver.reactor;


import socketserver.processor.ForwardProcessor;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.util.Arrays;
import java.util.Objects;

public class Handler implements Runnable {
    private SocketChannel channel;
    private SelectionKey key;
    private ByteBuffer returnBuffer = ByteBuffer.allocate(1024 * 2024);

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
            //根据读取内容判断请求类型
            String res = new String(byteBuffer.array());
//            System.out.println(res);
//            URL url =  this.getClass().getClassLoader().getResource("templates/test.html");
//
//            File f = new File(Objects.requireNonNull(url != null ? url.toURI() : null));
//            RandomAccessFile rf = new RandomAccessFile(f,"rw");
//            FileChannel fc = rf.getChannel();
//
//            fc.transferTo(0, rf.length(), channel);
//            System.out.println("!!!");
            //转发
            new ForwardProcessor(byteBuffer, returnBuffer, key, channel).run();
//            Processor.forward(byteBuffer, returnBuffer, key);
        } catch (IOException e) {
            try {
                key.cancel();
                channel.close();
            } catch (IOException e1) {
                e1.printStackTrace();
            }
            e.printStackTrace();
        }
//        catch (URISyntaxException e) {
//            e.printStackTrace();
//        }
    }

    private void write() {
        try {
//            System.out.println(new String(returnBuffer.array()));
            channel.write(returnBuffer);
            returnBuffer.clear();
            key.cancel();
            channel.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

}
