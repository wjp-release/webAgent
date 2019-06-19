package socketserver;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;

public class Processer {


    public void processHttp() {


    }

    public void forward(ByteBuffer inBuffer, ByteBuffer returnBuffer) throws IOException {
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
    }
}
