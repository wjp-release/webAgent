package socketserver.utils;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author cetc28
 */
public class StaticCache {

    private ConcurrentHashMap<String, CacheNode> cacheMap = new ConcurrentHashMap<>();
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


    public void put(String fname, CacheNode node) {
//        CacheNode node = new CacheNode(content);
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

    private void moveToHead(String fname, CacheNode cacheNode) {
        lock.lock();
        try {
            cacheNode.prev.next = cacheNode.next;
            cacheNode.next.prev = cacheNode.prev;
            cacheNode.next = null;
            cacheNode.prev = null;
            //放入head;
            head.prev = cacheNode;
            cacheNode.next = head;
        } finally {
            lock.unlock();
        }

    }

    public String get(String fname) {
        CacheNode cacheNode = cacheMap.get(fname);
        if (cacheNode != null) {
            moveToHead(fname, cacheNode);
            return cacheNode.staticContext;
        } else {
            //获取资源

//            put(fname, );
        }


        return null;
    }


}
