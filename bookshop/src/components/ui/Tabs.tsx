import { useState, useEffect, useRef, type ReactNode } from "react";
import styles from "./Tabs.module.css";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

  useEffect(() => {
    const updateSliderPosition = () => {
      const activeTabElement = tabRefs.current.get(activeTab);
      const tabListElement = tabListRef.current;

      if (activeTabElement && tabListElement) {
        const tabListRect = tabListElement.getBoundingClientRect();
        const activeTabRect = activeTabElement.getBoundingClientRect();
        
        setSliderStyle({
          left: activeTabRect.left - tabListRect.left,
          width: activeTabRect.width,
        });
      }
    };

    updateSliderPosition();
    window.addEventListener("resize", updateSliderPosition);
    
    return () => {
      window.removeEventListener("resize", updateSliderPosition);
    };
  }, [activeTab, tabs]);

  const setTabRef = (tabId: string, element: HTMLButtonElement | null) => {
    if (element) {
      tabRefs.current.set(tabId, element);
    } else {
      tabRefs.current.delete(tabId);
    }
  };

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList} ref={tabListRef}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            ref={(el) => setTabRef(tab.id, el)}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <div 
          className={styles.slider}
          style={{
            left: `${sliderStyle.left}px`,
            width: `${sliderStyle.width}px`,
          }}
        />
      </div>
      <div className={styles.tabContent}>
        {activeContent}
      </div>
    </div>
  );
}








