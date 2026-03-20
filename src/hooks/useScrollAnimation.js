/**
 * Custom hook for GSAP scroll-triggered animations
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const {
      animation = 'fadeInUp',
      duration = 0.8,
      delay = 0,
      stagger = 0.1,
      start = 'top 85%',
      children = false
    } = options;

    const animations = {
      fadeInUp: {
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0 }
      },
      fadeInLeft: {
        from: { opacity: 0, x: -50 },
        to: { opacity: 1, x: 0 }
      },
      fadeInRight: {
        from: { opacity: 0, x: 50 },
        to: { opacity: 1, x: 0 }
      },
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 }
      },
      scaleIn: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 }
      },
      slideUp: {
        from: { opacity: 0, y: 100 },
        to: { opacity: 1, y: 0 }
      }
    };

    const anim = animations[animation] || animations.fadeInUp;
    const targets = children ? element.children : element;

    gsap.fromTo(targets, anim.from, {
      ...anim.to,
      duration,
      delay,
      stagger: children ? stagger : 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start,
        toggleActions: 'play none none reverse'
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, []);

  return ref;
};

export default useScrollAnimation;
