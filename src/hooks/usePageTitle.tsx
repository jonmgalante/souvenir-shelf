
import { useEffect } from 'react';

/**
 * A hook to set the page title dynamically
 * @param title The title to append to the base app name
 * @param withAppName Whether to include the app name in the title
 */
const usePageTitle = (title?: string, withAppName: boolean = true) => {
  useEffect(() => {
    const appName = 'SouvieShelf - Your Travel Archive';
    
    if (!title) {
      document.title = appName;
      return;
    }
    
    document.title = withAppName ? `${title} | ${appName}` : title;
    
    // Reset title when component unmounts
    return () => {
      document.title = appName;
    };
  }, [title, withAppName]);
};

export default usePageTitle;
