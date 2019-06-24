package socketserver;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.util.Iterator;
import java.util.Set;

public class Reactor implements Runnable {
    private Selector serverSelector;

    public Reactor() {
        try {
            ServerSocketChannel serverSocket = ServerSocketChannel.open();
            serverSocket.configureBlocking(false);
            serverSelector = Selector.open();
            serverSocket.socket().bind(new InetSocketAddress(8000));
            SelectionKey acceptKey = serverSocket.register(serverSelector, SelectionKey.OP_ACCEPT);
            acceptKey.attach(new Acceptor(serverSocket,serverSelector));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void run() {
        try {
            while (!Thread.interrupted()) {
                serverSelector.select();
                Set<SelectionKey> keys = serverSelector.selectedKeys();
                Iterator<SelectionKey> it = keys.iterator();
                while (it.hasNext()){
                    SelectionKey tmpKey = it.next();
                    it.remove();
                    Dispatcher.dispatch(tmpKey);
                }
                keys.clear();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
