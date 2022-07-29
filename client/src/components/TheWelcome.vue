<script setup lang="ts">
import { ref } from "vue";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const isConnected = ref<boolean>(false);

const handleDisconnect = () => socket?.disconnect();

const handleConnect = () => {
  socket?.disconnect();
  socket = io("http://localhost:3000", { path: "/socket" });

  socket.on("connect", () => {
    isConnected.value = true;
  });

  socket.on("disconnect", () => {
    isConnected.value = false;
  });

  socket.on("ping", (data) => {
    console.log("Got ping from server", data);
  });
};

const handlePing = () => {
  console.log("Pinging");
  socket?.emit("ping", "This is a ping!");
};
</script>

<template>
  <div>
    <button @click="handleConnect">Connect socket</button>
    <button @click="handleDisconnect">Disconnect socket</button>
    <button @click="handlePing">Ping!</button>
  </div>
  <div>
    <p>Is connected: {{ isConnected }}</p>
  </div>
</template>
