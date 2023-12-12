import * as React from "react";
import { SVGProps, Ref, forwardRef } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 5 645 645" ref={ref} {...props}>
    <path
      fill="currentColor"
      d="M308 7.7c-27.4 2-56 7.6-79.5 15.5-63 21-118.2 61.5-161.2 117.9-27.9 36.7-47.7 81.1-56.8 127.3-6 30.7-7.8 74.6-4.1 101.4C19.9 469.5 72.3 550.9 157.2 604c14.5 9.1 41.8 22.6 57.6 28.4 36.8 13.7 72.1 19.9 112.2 19.7 36.3-.1 67.3-5 103.5-16.2 51.8-16.2 94.6-42.9 134-84 49.2-51.3 78-110.9 87.1-180.4 2.4-18.3 2.5-57 .1-76-4.4-34.5-16.8-78.7-25.3-90.4-12.2-16.5-43.4-30-79.1-34.1-10.7-1.3-45.6-1-46.9.3-.4.4-.2 3.6.4 7.1 2.6 13.8 1 56-2.9 75.6-3.9 19.9-14.1 53.6-22.5 73.8-21.2 51.4-62.1 109.8-104.1 148.9-16.2 15.1-22.9 20.5-38.4 31.5-30.7 21.7-59.1 37-83.6 44.9-4 1.2-7.3 2.6-7.3 3 0 1.2 8.3 11.9 16.5 21.2 6.4 7.3 8.1 8.7 9.9 8.1 3.1-1 25.2-9.8 32.1-12.9 19.8-8.8 39.1-20.1 59.8-34.9 17.2-12.3 23.7-17.6 40.7-33.5l12.5-11.7 9-2.3c20-5.2 46.7-16.5 60.3-25.6 9.3-6.1 9.3-5.1.5 6.9-32.2 43.4-71.1 79.3-113.8 104.9-34 20.4-62.9 31.9-99.2 39.7l-10.2 2.2-7.5-5.6C217 586.3 190.8 543.4 179 492c-5.8-25.4-6.5-32-6.5-64.5 0-27.7.2-31 2.4-42.8 1.4-7 2.7-12.7 3.1-12.7.3 0 2.3 3.5 4.4 7.7 2.1 4.2 8.2 14.1 13.6 21.8l9.9 14.2v20.4c0 20.2.7 28 3.7 42.7 2.8 13.9 8 30.7 12.4 40.4l1.3 2.7 9.7-4.9c15.1-7.6 40.6-24 49-31.6l3.5-3.2 17 8.4c9.4 4.6 17.5 8.4 18.1 8.4.7 0 7.2-4.8 14.5-10.7 14.2-11.3 53.8-49.7 52.6-50.9-.4-.4-4.7-1.8-9.7-3-7.7-2-24.5-8.5-28.9-11.3-1.1-.7.6-3.1 7.5-10.8 19.8-21.8 33.8-39.9 51.9-67.3 21.3-32 34.3-56.5 46-86.5 10.7-27.5 13.3-36.5 22-77.1.6-2.5 1.5-15.3 2.4-33.4l.6-12.5 7-.8c9.7-1.2 38.9-.1 51.3 1.8 19.3 3 41.7 10.8 56.3 19.5 4.3 2.7 7.6 4.3 7.2 3.7-7-12.4-29.8-41.1-45.2-57-17.8-18.3-36.1-32.9-59.4-47.3-36.4-22.6-81.9-39.2-122.7-44.9-19-2.6-50.6-4-66-2.8zm60.3 24.9c4.1.7 4.9 2.1 1.5 2.8-1.3.2-6.1 1.2-10.8 2.1-26.7 5.2-60.5 16.8-86.6 29.8-12.1 6-37.5 21.4-46.9 28.5-21.6 16.3-48.5 42.3-64.8 62.7-9.8 12.2-23.6 32.3-31.6 45.9-23 39.2-38.9 87.7-44.2 134.6-1.8 16.1-1.6 56.9.4 73 6.1 50.1 24.7 96.7 53.6 134.4 9.5 12.5 28 31.7 38.6 40.3 9.4 7.6 32.5 23.3 39.6 26.8 12.5 6.4-.2 5.5-17-1.2-26.5-10.5-49.8-25.9-70.6-46.8-20.4-20.5-33.3-38.1-44.9-61.1-15-29.9-21.9-53.4-25.7-86.9-1.7-15.2-1.5-50.3.4-64 5.2-37.1 17.9-72.7 36.8-102.5l4.7-7.5.5-16.5c1.1-32.9 11.6-66.6 29.2-92.9 19.8-29.6 48.9-55.3 81.5-72 31.4-16.1 58.5-23.7 104.5-29.4 5.2-.7 47.8-.7 51.8-.1zm54.1 28c1.1 2.8.7 3.1-5.6 4.4-10.2 1.9-28 6.7-38.5 10.4-36.3 12.5-65 27.8-95.8 51-28.2 21.2-60.3 54.8-81.6 85.6-32.1 46.3-56.5 106-63.8 156.6-4 27.4-4.9 64.8-2 88.9 1.6 13.7 1 15-2.2 5.2-11.7-35.3-15.1-94.2-7.9-136.5 7.1-41.4 23.5-82.9 46.8-118.2 15.8-23.9 27.6-38.3 47.8-58.1 27.5-26.9 48.6-42 81.9-58.7 32.4-16.2 70.8-27.4 106-31.1 12.6-1.3 14.2-1.3 14.9.5zm13.5 44.1c.7 4.3 1.7 8.8 2.2 10.1 1.9 4.8 1.2 5.9-4.3 7.2-19.3 4.6-51.2 18.5-71.2 30.9-22.9 14.3-37.1 25.7-54.2 43.3-29.9 30.9-45.4 55.1-56 87.4-3 9.2-5.2 16.9-4.9 17.2.3.3 1-1 1.7-2.9 1.7-5.2 11.4-23.4 16-30.3 29.6-43.9 68.4-77.4 118.7-102.6 20-10 53.9-22.5 55.8-20.6 1.1 1-1.6 27.2-4.3 41.5-9.1 49.9-33.1 101.4-72.3 154.6-30.2 41.1-62.8 76.3-97.2 105-20.9 17.5-45.3 34.4-49.5 34.5-.7 0-1-3.3-.7-10.2.6-18 3.2-36.8 5.1-36.8.4 0 4.1 3.4 8.2 7.5s7.8 7.5 8.3 7.5c2.5 0 31.8-24.9 53.7-45.8l11.5-10.9-8-7.4c-4.4-4.1-9.6-9.2-11.6-11.3l-3.7-3.9 3.6-6.1c6-10.4 20.8-31.8 29.7-42.8 16.1-20.2 45.7-48 64.9-61.1 3.3-2.3 10.6-6.7 16.1-9.9l9.9-5.8 5.3-16.2c5.4-16.6 10.4-33.8 9.8-33.8-1.6 0-18.9 8.1-27.4 12.8-51.8 28.7-97.8 73.2-126.6 122.7-3.2 5.5-6.2 10.4-6.7 10.9-1.1 1.4-12-22.2-16.1-34.9-5.7-17.7-7.8-30.6-8.4-51l-.5-18 7.2-10c51-70.4 122.8-117.9 194.1-128.4.3-.1 1.2 3.4 1.8 7.6zm172.1 174c3.9 10.4 8 29.6 9.6 44.8 3.8 36.2-2.2 73.5-18.3 113-11 27.3-28.7 53.1-51 74.6-15.6 15-31.7 25.6-54.3 35.6-12.5 5.5-31.7 11.9-32.8 10.9-.3-.4 2.3-3.3 5.9-6.5 14-12.7 37.1-39.5 53.8-62.5 25.8-35.6 43.9-69.7 58.9-110.6 12.5-34.4 20.9-69 23.7-98.3.4-3.7 1-6.7 1.5-6.7s1.8 2.6 3 5.7z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
export { ForwardRef as AppLogoSVG };
