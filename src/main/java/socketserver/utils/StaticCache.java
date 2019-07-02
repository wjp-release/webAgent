package socketserver.utils;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author cetc28
 */
public class StaticCache {

    ConcurrentHashMap<String, CacheNode> cacheMap = new ConcurrentHashMap<>();
    int ttl;
    private volatile CacheNode tail;
    private volatile CacheNode head;
    private static ReentrantLock lock = new ReentrantLock();

    private static class CacheNode {
        private CacheNode next;
        private CacheNode prev;
        private String staticContext;

        CacheNode(String staticContext) {
            this.staticContext = staticContext;
        }

        CacheNode(CacheNode next, CacheNode prev, String staticContext) {
            this.next = next;
            this.prev = prev;
            this.staticContext = staticContext;
        }
    }


    public void evict() {

    }


    public void put(String fname, String content) {
        CacheNode node = new CacheNode(content);
        cacheMap.put(fname, node);
        lock.lock();
        //挂链表
        if (head != null) {
            node.next = head;
            head.prev = node;
        }
        head = node;
        lock.unlock();
    }

    public String get(String fname) {
        CacheNode cacheNode = cacheMap.get(fname);
        if (cacheNode != null) {
            //放入head;

           return cacheNode.staticContext;
        }else {
//            put(fname, );
        }


        return null;
    }


}
