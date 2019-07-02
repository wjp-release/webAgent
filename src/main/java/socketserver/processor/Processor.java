package socketserver.processor;

import socketserver.threadpool.HandlerThreadFactory;

import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class Processor {

    private static ThreadPoolExecutor executor;

    static {
        executor = new ThreadPoolExecutor(10, 500, 2, TimeUnit.SECONDS, new LinkedBlockingDeque<>(), new HandlerThreadFactory("handler"));
    }

    public static void forward(ByteBuffer inBuffer, ByteBuffer returnBuffer, SelectionKey key) {
//        executor.execute(new ForwardProcessor(inBuffer, returnBuffer, key));
    }

    public void processHttp(){

    }

}
