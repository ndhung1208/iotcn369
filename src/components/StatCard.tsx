// import { Box, Typography } from "@mui/material";
// import type { ReactNode } from "react";

// type Props = {
//   title: string;
//   value: string;
//   unit?: string;
//   icon: ReactNode;
//   description?: string;
// };

// export default function StatCard({ title, value, unit, icon, description }: Props) {
//   return (
//     <Box
//       sx={{
//         bgcolor: "white",
//         borderRadius: 2.5,
//         p: 2,
//         boxShadow: "0 1px 4px rgba(0,0,0,.06)",
//         border: "1px solid #f0f0f0",
//         display: "flex",
//         alignItems: "center",
//         gap: 1.5,
//         height: "100%",
//       }}
//     >
//       <Box
//         sx={{
//           width: 40,
//           height: 40,
//           borderRadius: 2,
//           display: "grid",
//           placeItems: "center",
//           bgcolor: "#f1f5f9",
//           color: "#475569",
//           flexShrink: 0,
//         }}
//       >
//         {icon}
//       </Box>

//       <Box sx={{ minWidth: 0 }}>
//         <Typography fontSize={12} color="text.secondary" noWrap>
//           {title}
//         </Typography>
//         <Typography fontSize={22} fontWeight={700} lineHeight={1.2}>
//           {value}
//           {unit && (
//             <Typography component="span" fontSize={13} fontWeight={500} sx={{ ml: 0.3 }}>
//               {unit}
//             </Typography>
//           )}
//         </Typography>
//         {description && (
//           <Typography fontSize={11} color="text.disabled">
//             {description}
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// }