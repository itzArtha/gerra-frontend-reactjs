import Markdown from "markdown-to-jsx";
import Term from "./terms.md";
import { useState } from "react";
const Terms = () => {
  const [content, setContent] = useState("");
  useState(() => {
    fetch(Term)
      .then((res) => res.text())
      .then((md) => {
        setContent(md);
      });
  }, []);
  return (
    <div className={"m-8"}>
      <Markdown children={content} />
    </div>
  );
};
export default Terms;
