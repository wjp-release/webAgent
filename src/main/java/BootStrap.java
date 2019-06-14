import socketserver.Reactor;
import socketserver.ServerSocket;

import java.io.IOException;

public class BootStrap {
    public static void main(String[] args) throws IOException {
//        ServerSocket serverSocket = new ServerSocket();
//        serverSocket.open();


        Reactor reactor = new Reactor();
        reactor.run();
    }
}
