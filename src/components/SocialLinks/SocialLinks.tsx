"use client";

import {
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  RedditShareCount,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

type SocialLinksProps = {
  post: {
    title?: string;
  };
  url: string;
  excerpt?: string;
};

export default function SocialLinks({ post, url, excerpt }: SocialLinksProps) {
  const iconSize = 33;
  const filter = (count: number) => (count > 0 ? count : "");
  const renderShareCount = (count: number) => (
    <div className="text-center">{filter(count)}</div>
  );

  const iconStyle = { filter: "saturate(0) contrast(1.4)" };

  return (
    <div className="flex w-full items-center justify-around">
      <RedditShareButton url={url} title={post.title}>
        <RedditIcon round size={iconSize} style={iconStyle} />
        <RedditShareCount url={url}>
          {(count: number) => renderShareCount(count)}
        </RedditShareCount>
      </RedditShareButton>
      <TwitterShareButton url={url} title={post.title}>
        <TwitterIcon round size={iconSize} style={iconStyle} />
      </TwitterShareButton>
      <FacebookShareButton url={url}>
        <FacebookIcon round size={iconSize} style={iconStyle} />
        <FacebookShareCount url={url}>
          {(count) => renderShareCount(count)}
        </FacebookShareCount>
      </FacebookShareButton>
      <LinkedinShareButton url={url} title={post.title}>
        <LinkedinIcon round size={iconSize} style={iconStyle} />
      </LinkedinShareButton>
      <TelegramShareButton url={url}>
        <TelegramIcon round size={iconSize} style={iconStyle} />
      </TelegramShareButton>
    </div>
  );
}
