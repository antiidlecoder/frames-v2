import { Metadata } from "next";
import App from "./app";

const appUrl = "https://frames-v2-theta.vercel.app";

const frame = {
  version: "next",
  imageUrl: `${appUrl}/opengraph-image`,
  button: {
    title: "Launch Frame",
    action: {
      type: "launch_frame",
      name: "Baseship",
      url: appUrl,
      splashImageUrl: `${appUrl}/baseship.svg`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Baship",
    openGraph: {
      title: "Baseships",
      description: "A Baseships experience",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
