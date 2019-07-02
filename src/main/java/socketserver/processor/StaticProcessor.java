package socketserver.processor;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.channels.FileChannel;
import java.nio.channels.SocketChannel;
import java.util.WeakHashMap;

public class StaticProcessor implements Runnable {

    private SocketChannel socketChannel;

    StaticProcessor(SocketChannel socketChannel){
        this.socketChannel = socketChannel;
    }


    public void accessFile(String filename, SocketChannel channel) throws IOException {
        RandomAccessFile raf = new RandomAccessFile(filename, "rw");
        FileChannel fileChannel = raf.getChannel();
        fileChannel.transferTo(0, raf.length(), channel);
    }

    public void processStatic(){

    }

    @Override
    public void run() {

    }
}
