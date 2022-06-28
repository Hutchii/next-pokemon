import React, { useEffect, useState } from "react";

const Fade: React.FC<{ show: boolean; children: JSX.Element}> = ({
  show,
  children,
}) => {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };
  console.log(show);
  return shouldRender ? (
    <div
      className={`${show ? "opacity-10" : "opacity-80"}`}
      // onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  ) : null;
};

export default Fade;
