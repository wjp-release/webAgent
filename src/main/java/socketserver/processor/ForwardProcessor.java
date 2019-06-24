package socketserver.processor;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;

public class ForwardProcessor implements Runnable {

    private ByteBuffer inBuffer;
    private ByteBuffer returnBuffer;
    private SelectionKey key;

    ForwardProcessor(ByteBuffer inBuffer, ByteBuffer returnBuffer, SelectionKey key) {
        this.inBuffer = inBuffer;
        this.returnBuffer = returnBuffer;
        this.key = key;
    }

    @Override
    public void run() {
        try {
            String res = new String(inBuffer.array());
            SocketChannel newChannel = SocketChannel.open();
            newChannel.connect(new InetSocketAddress("127.0.0.1", 8888));
            ByteBuffer writeBuffer = ByteBuffer.allocate(4096);
            res = res.replace("8000", "8888");
            System.out.println(res);
            writeBuffer.put(res.getBytes());
            writeBuffer.flip();
            newChannel.write(writeBuffer);
            returnBuffer.clear();
            try {
                newChannel.read(returnBuffer);
            } catch (Exception e) {
                e.printStackTrace();
            }
            String response = new String(returnBuffer.array());
            System.out.println(response);
            returnBuffer.flip();
            key.interestOps(SelectionKey.OP_WRITE);
            key.selector().wakeup();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
