package socketserver.reactor;

import java.io.IOException;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;

public class Acceptor implements Runnable {

    private Selector selector;
    private ServerSocketChannel serverSocket;

    Acceptor(ServerSocketChannel serverSocket, Selector selector) {
        this.serverSocket = serverSocket;
        this.selector = selector;
    }

    @Override
    public void run() {
        try {
            SocketChannel channel = serverSocket.accept();
            if (channel != null) {
                new Handler(channel, selector);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
