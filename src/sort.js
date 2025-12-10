import * as aq from "arquero";
export default function (data) {
  const table = aq.from(data);
  const sorted = table.orderby(aq.desc("percent")).objects();

  return sorted;
}
