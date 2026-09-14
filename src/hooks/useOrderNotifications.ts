import { useEffect, useRef, useCallback, useState } from "react";
import { useGetRecentOrdersQuery } from "@/store/api/adminApi";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";

const POLL_INTERVAL = 30000; // 30 seconds

interface UseOrderNotificationsOptions {
  enabled: boolean;
  onNewOrder?: (order: Order) => void;
}

export function useOrderNotifications({
  enabled,
  onNewOrder
}: UseOrderNotificationsOptions) {
  const router = useRouter();
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const seenOrdersRef = useRef<Set<string>>(new Set());

  const { data, refetch } = useGetRecentOrdersQuery(
    { since: lastCheck.toISOString() },
    {
      skip: !enabled,
      pollingInterval: POLL_INTERVAL,
    }
  );

  const showNotification = useCallback((order: Order) => {
    // Show browser notification only if API is available
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      const notification = new Notification("طلب جديد 🛍️", {
        body: `طلب رقم ${order.orderNumber} - ${order.totalAmount} جنيه`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-96x96.png",
        tag: `order-${order._id}`,
        data: {
          url: `/admin/dashboard/orders`,
          orderId: order._id,
        },
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        router.push(`/admin/dashboard/orders`);
        notification.close();
      };
    }

    // Play notification sound
    try {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch((err) => console.log("Audio play failed:", err));
    } catch (err) {
      console.log("Audio not available:", err);
    }

    // Callback
    if (onNewOrder) {
      onNewOrder(order);
    }
  }, [router, onNewOrder]);

  useEffect(() => {
    if (!enabled || !data?.data?.orders) return;

    const newOrders = data.data.orders.filter(
      (order) => !seenOrdersRef.current.has(order._id)
    );

    if (newOrders.length > 0) {
      console.log(`🔔 ${newOrders.length} طلب جديد!`);

      newOrders.forEach((order) => {
        seenOrdersRef.current.add(order._id);
        showNotification(order);
      });

      // Update last check time
      setLastCheck(new Date());
    }
  }, [data, enabled, showNotification]);

  return {
    refetch,
    lastCheck,
  };
}
