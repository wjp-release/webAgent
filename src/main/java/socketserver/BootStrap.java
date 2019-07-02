package socketserver;

import socketserver.reactor.Reactor;

import java.io.IOException;

public class BootStrap {
    public static void main(String[] args) throws IOException {
        Reactor reactor = new Reactor();
        reactor.run();
    }
}
