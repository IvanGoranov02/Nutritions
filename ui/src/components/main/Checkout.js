import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import BodyForm from "./BodyForm";
import MealForm from "./MealForm";
import Review from "./Review";
import { useSelector, useDispatch } from "react-redux";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const steps = ["Calorie Calculator", "Meal planner", "Review your plan"];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <BodyForm />;
    case 1:
      return <MealForm />;
    case 2:
      return <Review />;
    default:
      throw new Error("Unknown step");
  }
}

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);
  const mealData = useSelector((state) => state.user.mealData);
  const isCalculated = useSelector((state) => state.form.isCalculated);
  console.log("Meal Data in Redux Store:", mealData);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // const handleDownload = () => {
  //   if (mealData) {
  //     const fileName = "meal_plan.json";
  //     const fileContent = JSON.stringify(mealData, null, 2);
  //     const blob = new Blob([fileContent], { type: "application/json" });
  //     saveAs(blob, fileName);
  //   } else {
  //     alert("No meal plan data to download.");
  //   }
  // };

  const handleDownloadPDF = () => {
    if (mealData) {
      const doc = new jsPDF();

      // Заглавие на документа
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Meal Plan", 14, 20);

      // За всяка седмица (ден)
      Object.entries(mealData.week).forEach(([day, data], index) => {
        const startY = doc.previousAutoTable
          ? doc.previousAutoTable.finalY + 10
          : 30;

        // Заглавие на деня
        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text(day.charAt(0).toUpperCase() + day.slice(1), 14, startY);

        // Таблица за храненията
        const mealRows = data.meals.map((meal) => [
          meal.title,
          `${meal.readyInMinutes} mins`,
          `${meal.servings} servings`,
          meal.sourceUrl,
        ]);

        doc.autoTable({
          startY: startY + 5,
          head: [["Meal", "Time", "Servings", "Source"]],
          body: mealRows,
          theme: "striped",
          headStyles: { fillColor: [22, 160, 133] },
          margin: { left: 14, right: 14 },
        });

        // Добавяне на нутриенти
        const nutrientsY = doc.previousAutoTable.finalY + 5;
        doc.setFontSize(12);
        doc.text("Nutrients:", 14, nutrientsY);
        doc.text(
          `Calories: ${data.nutrients.calories.toFixed(2)}`,
          14,
          nutrientsY + 5
        );
        doc.text(
          `Protein: ${data.nutrients.protein.toFixed(2)}g`,
          14,
          nutrientsY + 10
        );
        doc.text(`Fat: ${data.nutrients.fat.toFixed(2)}g`, 14, nutrientsY + 15);
        doc.text(
          `Carbohydrates: ${data.nutrients.carbohydrates.toFixed(2)}g`,
          14,
          nutrientsY + 20
        );
      });

      // Запазване на PDF файла
      doc.save("meal_plan.pdf");
    } else {
      alert("No meal plan data to download.");
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          backgroundColor: "#e5f3ff",
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="#1976D2" noWrap>
            Healthy & Fit
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        maxWidth="sm"
        sx={{ mb: 4, backgroundColor: "#ffffff" }}
      >
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="#1976D2"
          >
            Free Health & Fitness Calculator
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Button
                variant="contained"
                onClick={handleDownloadPDF}
                sx={{
                  mt: 3,
                  ml: 1,
                  backgroundColor: "#1976D2",
                  color: "white",
                }}
              >
                Download Meal Plan
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    mt: 3,
                    ml: 1,
                    backgroundColor: "#1976D2",
                    color: "white",
                  }}
                  disabled={activeStep === 0 && !isCalculated}
                >
                  {activeStep === steps.length - 1 ? "Download" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </React.Fragment>
  );
}
