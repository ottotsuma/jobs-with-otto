"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { supabase } from "superbase";
import { styled } from "@stitches/react";
import { Container, Title } from "@/styles/basic";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
import { Vacancy } from "@/types/vacancies";
import { useTitle } from "@/contexts/TitleContext";
const Grid = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "16px",
});

const Card = styled(Link, {
  display: "block",
  padding: "16px",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  textDecoration: "none",
  color: "black",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
  },
});

const CardTitle = styled("h2", {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "8px",
});

const CardDetails = styled("p", {
  fontSize: "14px",
  marginBottom: "8px",
});

const DetailRow = styled("div", {
  marginBottom: "8px",
});

export default function VacanciesPage() {
  const currentLocale = useLocale();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [search, setSearch] = useState("");

  const filteredVacancies = useMemo(() => {
    return vacancies.filter(
      (v) =>
        v.job_title.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, vacancies]);

  const { setTitle } = useTitle();
  useEffect(() => {
    setTitle("Vacancies");
    async function fetchVacancies() {
      const { data, error } = await supabase.from("vacancies").select("*");
      if (!error) setVacancies(data);
    }
    fetchVacancies();
  }, []);

  return (
    <Container>
      <Title>Vacancies</Title>
      <input
        type="text"
        placeholder="Search by title or description"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Grid>
        {filteredVacancies.map((vacancy) => (
          <Card key={vacancy.id} href={`vacancies/${vacancy.id}`}>
            <CardTitle>{vacancy.job_title}</CardTitle>
            <CardDetails>{vacancy.description}</CardDetails>
            <DetailRow>
              <strong>Job Level:</strong> {vacancy.job_level}
            </DetailRow>
            <DetailRow>
              <strong>Salary:</strong>{" "}
              {vacancy.yearly_salary
                ? `$${vacancy.yearly_salary} / year`
                : vacancy.month_salary
                  ? `$${vacancy.month_salary} / month`
                  : vacancy.day_salary
                    ? `$${vacancy.day_salary} / day`
                    : vacancy.hourly_rate
                      ? `$${vacancy.hourly_rate} / hour`
                      : "N/A"}
            </DetailRow>
            {vacancy.special_instructions && (
              <DetailRow>
                <strong>Special Instructions:</strong>{" "}
                {vacancy.special_instructions}
              </DetailRow>
            )}
          </Card>
        ))}
      </Grid>
    </Container>
  );
}

// That’s a **great middle-ground**! You can build a **mini query language**, something like:

// ```txt
// salary:<10000 level:>=2 title:engineer
// ```

// This keeps users flexible, while **you still control the SQL generation**, preventing abuse or injection.

// ---

// ### 🔧 Plan:

// 1. **Parse the input string** into filters.
// 2. **Convert filters to Supabase query chain**.
// 3. **Execute the query**.

// ---

// ### ✅ Example Input Syntax:

// | Keyword     | Meaning                              |
// |-------------|--------------------------------------|
// | `salary:<10000` | Salary less than 10,000           |
// | `level:>=2`     | Job level greater than or equal 2 |
// | `title:engineer` | Title contains “engineer”        |

// ---

// ### ✅ Frontend Parsing (TS):

// ```ts
// function parseSearchQuery(query: string) {
//   const parts = query.match(/(\w+:\S+)/g) || [];
//   const filters: Record<string, { op: string, value: string }> = {};

//   for (const part of parts) {
//     const [key, rawValue] = part.split(":");
//     const match = rawValue.match(/(<=|>=|<|>|=)?(.+)/);

//     if (match) {
//       const [, op = "=", value] = match;
//       filters[key] = { op, value };
//     }
//   }

//   return filters;
// }
// ```

// ---

// ### ✅ Apply to Supabase Query:

// ```ts
// async function fetchVacanciesWithFilters(queryString: string) {
//   const filters = parseSearchQuery(queryString);
//   let query = supabase.from("vacancies").select("*");

//   for (const key in filters) {
//     const { op, value } = filters[key];

//     switch (key) {
//       case "salary":
//         query = query[op === "=" ? "eq" : op === "<" ? "lt" : op === ">" ? "gt" : op === "<=" ? "lte" : op === ">=" ? "gte" : "eq"]("yearly_salary", Number(value));
//         break;
//       case "level":
//         query = query[op === "=" ? "eq" : op === "<" ? "lt" : op === ">" ? "gt" : op === "<=" ? "lte" : op === ">=" ? "gte" : "eq"]("job_level", Number(value));
//         break;
//       case "title":
//         query = query.ilike("job_title", `%${value}%`);
//         break;
//       // Add more fields here
//     }
//   }

//   const { data, error } = await query;
//   if (!error) setVacancies(data);
// }
// ```

// ---

// ### ✅ In Your Component:

// ```tsx
// const [queryString, setQueryString] = useState("");

// useEffect(() => {
//   fetchVacanciesWithFilters(queryString);
// }, [queryString]);

// return (
//   <input
//     type="text"
//     placeholder='Try: salary:<10000 level:>=2 title:engineer'
//     value={queryString}
//     onChange={(e) => setQueryString(e.target.value)}
//   />
// );
// ```

// ---

// ### 🔒 Bonus Safety:
// - Sanitize and validate numbers before passing to Supabase.
// - Limit accepted keys to known fields.

// ---

// Want me to bundle this as a custom hook or utility file?
