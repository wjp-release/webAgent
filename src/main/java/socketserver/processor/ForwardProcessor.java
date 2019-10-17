package socketserver.processor;


import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.SocketChannel;

public class ForwardProcessor implements Runnable {

    private ByteBuffer inBuffer;
    private ByteBuffer returnBuffer;
    private SelectionKey key;
    private SocketChannel channel;


    public ForwardProcessor(ByteBuffer inBuffer, ByteBuffer returnBuffer, SelectionKey key, SocketChannel channel) {
        this.inBuffer = inBuffer;
        this.returnBuffer = returnBuffer;
        this.key = key;
        this.channel = channel;
    }

    @Override
    public void run() {
        try {
            String res = new String(inBuffer.array());
            byte[] s = new byte[1024 * 2000];
            int offset = 0;
            SocketChannel newChannel = SocketChannel.open();
            newChannel.connect(new InetSocketAddress("127.0.0.1", 8081));
            ByteBuffer writeBuffer = ByteBuffer.allocate(4096);
            res = res.replace("8000", "8081");
            System.out.println(res);
            writeBuffer.put(res.getBytes());
            writeBuffer.flip();
            newChannel.write(writeBuffer);
            returnBuffer.clear();

            ByteBuffer tmpbuffer = ByteBuffer.allocate(1024 * 500);
            try {
                while (newChannel.read(tmpbuffer) != -1) {
                    offset++;
                    tmpbuffer.flip();
                    int writeBytes = 0;
                    do {
                        writeBytes = channel.write(tmpbuffer);
                    } while (writeBytes == 0);
                    tmpbuffer.clear();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
//            String response = new String(returnBuffer.array());
//            System.out.println(response);
//            returnBuffer.flip();
            key.cancel();
            channel.close();
//            key.interestOps(SelectionKey.OP_WRITE);
//            key.selector().wakeup();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
