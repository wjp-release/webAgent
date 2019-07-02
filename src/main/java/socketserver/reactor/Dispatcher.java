package socketserver.reactor;

import java.nio.channels.SelectionKey;

public class Dispatcher {

    public static void dispatch(SelectionKey key){
        Runnable runnable = (Runnable) key.attachment();
        runnable.run();
    }

}
