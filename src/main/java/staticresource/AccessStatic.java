package staticresource;

import java.io.RandomAccessFile;
import java.lang.ref.WeakReference;
import java.nio.channels.FileChannel;
import java.util.WeakHashMap;

public class AccessStatic {

    WeakHashMap<String, byte[]> staticFiles;

    public void accessFile(String filename) {
        FileChannel fileChannel = FileChannel.open(filename, );


    }

//    public void channelRead0(ChannelHandlerContext ctx, String msg) throws Exception {
//        RandomAccessFile raf = null;
//        long length = -1;
//        try {
//            // 1. 通过 RandomAccessFile 打开一个文件.
//            raf = new RandomAccessFile(msg, "r");
//            length = raf.length();
//        } catch (Exception e) {
//            ctx.writeAndFlush("ERR: " + e.getClass().getSimpleName() + ": " + e.getMessage() + '\n');
//            return;
//        } finally {
//            if (length < 0 && raf != null) {
//                raf.close();
//            }
//        }
//
//        ctx.write("OK: " + raf.length() + '\n');
//        if (ctx.pipeline().get(SslHandler.class) == null) {
//            // SSL not enabled - can use zero-copy file transfer.
//            // 2. 调用 raf.getChannel() 获取一个 FileChannel.
//            // 3. 将 FileChannel 封装成一个 DefaultFileRegion
//            ctx.write(new DefaultFileRegion(raf.getChannel(), 0, length));
//        } else {
//            // SSL enabled - cannot use zero-copy file transfer.
//            ctx.write(new ChunkedFile(raf));
//        }
//        ctx.writeAndFlush("\n");
//    }
}
