import { useState, useEffect } from "react";
import { useLocation } from "./Location";

export default function Clock({ isHere }: { isHere: boolean }) {
  const [time, setTime] = useState(new Date());
  const { hereOffset, thereOffset } = useLocation();

  useEffect(() => {
    const timer = setInterval(() => { setTime(new Date()); }, 1000);
    return () => { clearInterval(timer); };
  }, []);

  const displayTime = (() => {
    if (isHere && hereOffset) {
      return new Date(time.getTime() + hereOffset.offset * 1000);
    } else if (!isHere && thereOffset) {
      return new Date(time.getTime() + thereOffset.offset * 1000);
    }
    return null;
  })();

  return (
    <div>
      <p className="pt-3">
        Datetime: {displayTime?.toUTCString().substring(5, 25)}
      </p>
      <p>
        Timezone: {isHere ? hereOffset?.timezone : thereOffset?.timezone}
      </p>
    </div>
  );
}