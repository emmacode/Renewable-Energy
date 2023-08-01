import { useState } from "react";

const Svg = () => {
  return <svg style={{ border: "2px solid gold" }} />;
};

const Circle = () => {
  return (
    <svg>
      <circle cx="150" cy="77" r="40" />
    </svg>
  );
};

const generateDataset = () =>
  Array(10)
    .fill(0)
    .map(() => [Math.random() * 80 + 10, Math.random() * 35 + 10]);

const Circles = () => {
  const [dataset, setDataset] = useState(generateDataset());

  setInterval(() => {
    const newDataset = generateDataset();
    setDataset(newDataset);
  }, 2000);

  return (
    <svg viewBox="0 0 100 50">
      {dataset.map(([x, y], i) => (
        <circle cx={x} cy={y} r="3" />
      ))}
    </svg>
  );
};

export { Svg, Circle, Circles };
