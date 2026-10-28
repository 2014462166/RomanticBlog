import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "home", component: HomeView, meta: { title: "首页", icon: "ph:planet" } },
  {
    path: "/calendar",
    name: "calendar",
    component: () => import("@/views/CalendarView.vue"),
    meta: { title: "日历回忆", icon: "ph:calendar-heart", desc: "月历视图：有记录的日期会发光，点开重温那一天。" },
  },
  {
    path: "/diary",
    name: "diary",
    component: () => import("@/views/DiaryView.vue"),
    meta: { title: "日记", icon: "ph:notebook", desc: "按时间回看我们的每一条记录。" },
  },
  {
    path: "/album",
    name: "album",
    component: () => import("@/views/AlbumView.vue"),
    meta: { title: "相册", icon: "ph:images", desc: "照片瀑布流 + 灯箱浏览，我们的每一帧美好。" },
  },
  {
    path: "/videos",
    name: "videos",
    component: () => import("@/views/VideosView.vue"),
    meta: { title: "视频集", icon: "ph:video-camera", desc: "会动的回忆都在这里。" },
  },
  {
    path: "/dates",
    name: "dates",
    component: () => import("@/views/DatesView.vue"),
    meta: { title: "重要日子", icon: "ph:gift", desc: "纪念日、生日与节日，倒计时与提醒。" },
  },
  {
    path: "/story",
    name: "story",
    component: () => import("@/views/StoryView.vue"),
    meta: { title: "我们的故事", icon: "ph:book-open-text", desc: "从相遇到现在的里程碑时间轴。" },
  },
  {
    path: "/letters",
    name: "letters",
    component: () => import("@/views/LettersView.vue"),
    meta: { title: "情书", icon: "ph:envelope-open", desc: "写给彼此的手写信。" },
  },
  {
    path: "/wishes",
    name: "wishes",
    component: () => import("@/views/WishesView.vue"),
    meta: { title: "心愿清单", icon: "ph:list-checks", desc: "一起要做的事，慢慢打勾完成。" },
  },
  {
    path: "/map",
    name: "map",
    component: () => import("@/views/MapView.vue"),
    meta: { title: "足迹地图", icon: "ph:map-trifold", desc: "一起去过的地方与当时的故事。" },
  },
  {
    path: "/capsule",
    name: "capsule",
    component: () => import("@/views/CapsuleView.vue"),
    meta: { title: "时间胶囊", icon: "ph:clock-clockwise", desc: "给未来某天的我们留一封信。" },
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
