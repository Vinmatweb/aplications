import React from "react";
import { createRoot } from "react-dom/client";
import Studio from "@/components/studio";
import "../app/globals.css";

const root = document.getElementById("root");
if (!root) throw new Error("Chybí kořen aplikace.");
createRoot(root).render(<Studio />);
