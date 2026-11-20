import { useCallback, useEffect, useRef, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { HERO_REVEAL_AT, HOME_MEDIA } from '../../config/site';

export type HeroStage = 'intro' | 'in';

// Điều khiển video mở đầu: chữ hiện khi video xong, có Bỏ qua / Xem lại,
// tôn trọng giảm chuyển động và ?intro=off khi đang chỉnh sửa.
export function useHeroIntro() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const revealedRef = useRef(false);
  const fallbackRef = useRef<number | null>(null);

  const [stage, setStage] = useState<HeroStage>('intro');
  const [progress, setProgress] = useState(0);
  const [videoOff, setVideoOff] = useState(false);
  const [src] = useState(() =>
    window.matchMedia('(max-width: 760px)').matches ? HOME_MEDIA.videoMobile : HOME_MEDIA.videoDesktop,
  );

  const clearFallback = useCallback(() => {
    if (fallbackRef.current !== null) {
      window.clearTimeout(fallbackRef.current);
      fallbackRef.current = null;
    }
  }, []);

  const reveal = useCallback(
    (hideVideo: boolean) => {
      clearFallback();
      if (!revealedRef.current) {
        revealedRef.current = true;
        setStage('in');
        setProgress(1);
      }
      if (hideVideo) setVideoOff(true);
    },
    [clearFallback],
  );

  const play = useCallback(() => {
    clearFallback();
    // Nếu video không kết thúc vì lý do nào đó, vẫn hiện chữ sau 12 giây
    fallbackRef.current = window.setTimeout(() => reveal(false), 12000);
    const video = videoRef.current;
    if (!video) return;
    try {
      const p = video.play();
      if (p) p.catch(() => reveal(true));
    } catch {
      reveal(true);
    }
  }, [clearFallback, reveal]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const skipIntro = /[?&]intro=off\b/.test(window.location.search);
    if (reduce || skipIntro) {
      reveal(true);
      return;
    }
    play();
    return clearFallback;
  }, [play, reveal, clearFallback]);

  const onTimeUpdate = (e: SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 8;
    if (!revealedRef.current) setProgress(video.currentTime / duration);
    if (video.currentTime >= Math.min(HERO_REVEAL_AT, duration - 0.05)) reveal(false);
  };

  const onEnded = () => reveal(false);
  const onError = () => reveal(true);

  const skip = () => {
    videoRef.current?.pause();
    reveal(true);
  };

  const replay = () => {
    const video = videoRef.current;
    revealedRef.current = false;
    setStage('intro');
    setVideoOff(false);
    setProgress(0);
    if (video) {
      try {
        video.currentTime = 0;
      } catch {
        /* một số trình duyệt chưa cho đặt thời điểm khi chưa tải xong */
      }
    }
    play();
  };

  return { videoRef, src, stage, progress, videoOff, onTimeUpdate, onEnded, onError, skip, replay };
}
