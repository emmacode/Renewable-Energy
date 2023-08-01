import React, { useState, useEffect } from "react";
import { WindFarmChart } from "./components/WindFarmChart";
import { fetchWindFarmData } from "./api/windFarmApi";
import { styled } from "styled-components";

export const Dashboard: React.FC = () => {
  const [windFarmData, setWindFarmData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchWindFarmData();
        setWindFarmData(data);
      } catch (error) {
        console.error("Error fetching wind farm data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <Container>
      <h1>Renewable Energy Asset Dashboard</h1>
      <WindFarmChart data={windFarmData} />
    </Container>
  );
};

export const Container = styled.div`
  text-align: center;

  & h1 {
    margin-bottom: 50px;
  }
`;
