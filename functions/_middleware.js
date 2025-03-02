// 简单的中间件函数，作为 Cloudflare Pages Functions 的入口点
export async function onRequest(context) {
  // 直接传递请求到静态资源
  return context.next();
} 