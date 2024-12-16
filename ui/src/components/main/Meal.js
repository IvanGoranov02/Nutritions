import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Meal({ meal }) {
  const [image, setImage] = useState("");

  useEffect(() => {
    axios
      .get(`https://api.spoonacular.com/recipes/${meal.id}/information`, {
        params: {
          apiKey: "d8e3ad4dee35418a928f00aae7ec7dce",
          includeNutrition: false,
        },
      })
      .then((response) => {
        setImage(response.data.image);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }, [meal.id]);

  // Define styles here
  const styles = {
    meal: {
      backgroundColor: "#f8f8f8",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      margin: "16px 0",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    title: {
      color: "#333",
      fontSize: "24px",
      marginBottom: "8px",
    },
    image: {
      maxWidth: "100%",
      height: "auto",
      borderRadius: "4px",
    },
    instructions: {
      listStyle: "none",
      padding: 0,
      marginTop: "16px",
    },
    instructionItem: {
      listStyle: "none",
      marginBottom: "4px",
      color: "#666",
    },
    link: {
      display: "inline-block",
      marginTop: "12px",
      backgroundColor: "#007bff",
      color: "white",
      padding: "8px 16px",
      borderRadius: "4px",
      textDecoration: "none",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <article style={styles.meal}>
      <h1 style={styles.title}>{meal.title}</h1>
      <img
        src={image || meal.imageUrl || "default_image.jpg"}
        alt={meal.title}
        style={styles.image}
      />
      <ul style={styles.instructions}>
        <li style={styles.instructionItem}>
          Preparation time: {meal.readyInMinutes} minutes
        </li>
        <li style={styles.instructionItem}>
          Number of servings: {meal.servings}
        </li>
      </ul>
      <a
        href={meal.sourceUrl}
        target="_blank"
        rel="noreferrer"
        style={styles.link}
      >
        Go to Recipe
      </a>
    </article>
  );
}
