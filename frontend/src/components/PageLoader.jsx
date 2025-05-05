import { LoaderIcon } from "lucide-react";
import { useSelector } from "react-redux";

const PageLoader = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className="min-h-screen flex items-center justify-center" data-theme={theme}>
      <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>
  );
};
export default PageLoader;
