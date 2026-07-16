export type CurriculumTopic = {
  code: string;
  title: string;
  summary: string;
  component: string;
  kind: "strand" | "topic";
  parentCode?: string;
  prerequisiteCodes: string[];
};

export type CurriculumPack = {
  key: string;
  awardingBody: "OCR";
  qualification: string;
  specificationCode: string;
  version: string;
  published: string;
  subject: string;
  sourceUrl: string;
  topics: CurriculumTopic[];
};

const topic = (
  code: string,
  title: string,
  summary: string,
  component: string,
  parentCode: string,
  prerequisiteCodes: string[] = [],
): CurriculumTopic => ({ code, title, summary, component, kind: "topic", parentCode, prerequisiteCodes });

const strand = (code: string, title: string, component: string): CurriculumTopic => ({
  code,
  title,
  summary: `The ${title.toLowerCase()} strand of the specification.`,
  component,
  kind: "strand",
  prerequisiteCodes: [],
});

const j277Topics: CurriculumTopic[] = [
  strand("1.1", "Systems architecture", "J277/01"),
  topic("1.1.1", "Architecture of the CPU", "Understand the CPU's main components and the fetch-execute cycle.", "J277/01", "1.1"),
  topic("1.1.2", "CPU performance", "Explain how clock speed, cache and processor cores affect performance.", "J277/01", "1.1", ["1.1.1"]),
  topic("1.1.3", "Embedded systems", "Recognise embedded systems and explain why they are used.", "J277/01", "1.1", ["1.1.1"]),
  strand("1.2", "Memory and storage", "J277/01"),
  topic("1.2.1", "Primary storage (memory)", "Compare RAM, ROM and virtual memory in a computer system.", "J277/01", "1.2", ["1.1.1"]),
  topic("1.2.2", "Secondary storage", "Compare common storage technologies by capacity, speed, portability and durability.", "J277/01", "1.2", ["1.2.1"]),
  topic("1.2.3", "Units", "Use bits, bytes and standard data units to calculate storage needs.", "J277/01", "1.2"),
  topic("1.2.4", "Data storage", "Represent numbers, characters, images and sound as binary data.", "J277/01", "1.2", ["1.2.3"]),
  topic("1.2.5", "Compression", "Compare lossy and lossless compression and choose suitable uses.", "J277/01", "1.2", ["1.2.4"]),
  strand("1.3", "Computer networks, connections and protocols", "J277/01"),
  topic("1.3.1", "Networks and topologies", "Explain network types, factors affecting performance and common topologies.", "J277/01", "1.3"),
  topic("1.3.2", "Wired and wireless networks, protocols and layers", "Describe connections, protocols, addressing and layered network models.", "J277/01", "1.3", ["1.3.1"]),
  strand("1.4", "Network security", "J277/01"),
  topic("1.4.1", "Threats to computer systems and networks", "Recognise social, software and physical threats to systems and data.", "J277/01", "1.4", ["1.3.1"]),
  topic("1.4.2", "Identifying and preventing vulnerabilities", "Select measures that find, reduce and respond to security vulnerabilities.", "J277/01", "1.4", ["1.4.1"]),
  strand("1.5", "Systems software", "J277/01"),
  topic("1.5.1", "Operating systems", "Explain the core roles performed by an operating system.", "J277/01", "1.5", ["1.1.1", "1.2.1"]),
  topic("1.5.2", "Utility software", "Explain how utility software maintains and protects a computer system.", "J277/01", "1.5", ["1.5.1"]),
  strand("1.6", "Ethical, legal, cultural and environmental impacts", "J277/01"),
  topic("1.6.1", "Ethical, legal, cultural and environmental impact", "Evaluate how digital technology affects people, communities and the environment.", "J277/01", "1.6"),
  topic("1.6.2", "Legislation", "Apply relevant UK legislation to computer science scenarios.", "J277/01", "1.6", ["1.6.1"]),
  strand("2.1", "Algorithms", "J277/02"),
  topic("2.1.1", "Computational thinking", "Use abstraction, decomposition and algorithmic thinking to frame problems.", "J277/02", "2.1"),
  topic("2.1.2", "Designing, creating and refining algorithms", "Read, write, trace and improve algorithms using suitable representations.", "J277/02", "2.1", ["2.1.1"]),
  topic("2.1.3", "Searching and sorting algorithms", "Explain and trace standard searching and sorting algorithms.", "J277/02", "2.1", ["2.1.2", "2.2.1"]),
  strand("2.2", "Programming fundamentals", "J277/02"),
  topic("2.2.1", "Programming fundamentals", "Use sequence, selection, iteration, variables, arrays and common operators.", "J277/02", "2.2"),
  topic("2.2.2", "Data types", "Select, convert and validate suitable data types.", "J277/02", "2.2", ["2.2.1"]),
  topic("2.2.3", "Additional programming techniques", "Use strings, files, records, subprograms, random values and structured data.", "J277/02", "2.2", ["2.2.1", "2.2.2"]),
  strand("2.3", "Producing robust programs", "J277/02"),
  topic("2.3.1", "Defensive design", "Build maintainable programs that anticipate invalid input and misuse.", "J277/02", "2.3", ["2.2.1"]),
  topic("2.3.2", "Testing", "Plan and use iterative and final testing with suitable test data.", "J277/02", "2.3", ["2.3.1"]),
  strand("2.4", "Boolean logic", "J277/02"),
  topic("2.4.1", "Boolean logic", "Construct and interpret logic diagrams, truth tables and Boolean expressions.", "J277/02", "2.4", ["2.2.1"]),
  strand("2.5", "Programming languages and IDEs", "J277/02"),
  topic("2.5.1", "Languages", "Compare high- and low-level languages and explain translation.", "J277/02", "2.5", ["2.2.1", "1.1.1"]),
  topic("2.5.2", "The Integrated Development Environment (IDE)", "Explain how common IDE tools support program development.", "J277/02", "2.5", ["2.5.1"]),
];

const mathsGroups = [
  ["1", "Number operations and integers"], ["2", "Fractions, decimals and percentages"],
  ["3", "Indices and surds"], ["4", "Approximation and estimation"],
  ["5", "Ratio, proportion and rates of change"], ["6", "Algebra"],
  ["7", "Graphs of equations and functions"], ["8", "Basic geometry"],
  ["9", "Congruence and similarity"], ["10", "Mensuration"],
  ["11", "Probability"], ["12", "Statistics"],
] as const;

const j560Topics: CurriculumTopic[] = [
  ...mathsGroups.map(([code, title]) => strand(code, title, "J560/01–06")),
  topic("1.01", "Calculations with integers", "Use the four operations, order of operations and inverse operations.", "Number", "1"),
  topic("1.02", "Properties of integers", "Work with factors, multiples, primes and integer structure.", "Number", "1", ["1.01"]),
  topic("2.01", "Fractions", "Compare, calculate with and interpret fractions.", "Number", "2", ["1.01"]),
  topic("2.02", "Decimals", "Order and calculate accurately with decimal values.", "Number", "2", ["1.01"]),
  topic("2.03", "Percentages", "Find percentages and solve percentage change problems.", "Number", "2", ["2.01", "2.02"]),
  topic("3.01", "Powers and roots", "Use index notation, powers, roots and index laws.", "Number", "3", ["1.02"]),
  topic("3.02", "Standard form", "Convert and calculate with numbers in standard form.", "Number", "3", ["3.01"]),
  topic("3.03", "Surds", "Simplify and calculate with exact surd expressions.", "Number", "3", ["3.01"]),
  topic("4.01", "Approximation and estimation", "Round, estimate, use bounds and judge the accuracy of answers.", "Number", "4", ["1.01", "2.02"]),
  topic("5.01", "Ratio", "Use ratios to compare, share and scale quantities.", "Ratio", "5", ["2.01"]),
  topic("5.02", "Proportion", "Model direct and inverse proportion in familiar and algebraic settings.", "Ratio", "5", ["5.01", "6.02"]),
  topic("5.03", "Rates of change", "Interpret compound measures and rates of change.", "Ratio", "5", ["5.01", "7.02"]),
  topic("6.01", "Algebraic expressions", "Form, simplify, expand and factorise algebraic expressions.", "Algebra", "6", ["1.01"]),
  topic("6.02", "Formulae", "Substitute into, rearrange and interpret formulae.", "Algebra", "6", ["6.01"]),
  topic("6.03", "Equations", "Form and solve linear, quadratic and other equations.", "Algebra", "6", ["6.01"]),
  topic("6.03c", "Simultaneous equations", "Solve pairs of equations algebraically and graphically.", "Algebra", "6", ["6.03", "7.01"]),
  topic("6.04", "Inequalities", "Represent and solve linear and quadratic inequalities.", "Algebra", "6", ["6.03"]),
  topic("6.05", "Functions", "Use function notation, inverse functions and composite functions.", "Algebra", "6", ["6.01"]),
  topic("6.06", "Sequences", "Describe, continue and find rules for numerical sequences.", "Algebra", "6", ["6.01"]),
  topic("7.01", "Coordinates and linear graphs", "Plot coordinates and connect equations, gradients and intercepts.", "Graphs", "7", ["6.01", "6.03"]),
  topic("7.02", "Real-life graphs", "Read and interpret graphs that represent changing quantities.", "Graphs", "7", ["7.01"]),
  topic("7.03", "Quadratic and other graphs", "Recognise, sketch and interpret non-linear functions.", "Graphs", "7", ["6.03", "7.01"]),
  topic("7.04", "Graphical rates of change", "Use gradients and areas to interpret rates and accumulated quantities.", "Graphs", "7", ["7.02"]),
  topic("8.01", "Geometrical language and properties", "Use standard notation and reason with lines, angles and polygons.", "Geometry", "8"),
  topic("8.02", "Constructions and loci", "Use instruments and reasoning to construct shapes and loci.", "Geometry", "8", ["8.01"]),
  topic("8.03", "Angles", "Apply angle facts in lines, polygons and parallel-line settings.", "Geometry", "8", ["8.01"]),
  topic("8.04", "Circle properties", "Use circle vocabulary and theorem-based reasoning.", "Geometry", "8", ["8.03"]),
  topic("9.01", "Transformations", "Describe and perform reflections, rotations, translations and enlargements.", "Geometry", "9", ["8.01", "7.01"]),
  topic("9.02", "Congruence and similarity", "Prove and use congruence and similarity, including scale factors.", "Geometry", "9", ["5.01", "8.01"]),
  topic("9.03", "Vectors", "Represent and prove geometrical relationships with vectors.", "Geometry", "9", ["6.01", "8.01"]),
  topic("10.01", "Units and measures", "Convert between units and interpret accuracy in measurement.", "Mensuration", "10", ["4.01"]),
  topic("10.02", "Perimeter and area", "Calculate and reason about the perimeter and area of 2D shapes.", "Mensuration", "10", ["8.01", "6.02"]),
  topic("10.03", "Volume and surface area", "Calculate and reason about prisms and other 3D shapes.", "Mensuration", "10", ["10.02"]),
  topic("10.04", "Pythagoras and trigonometry", "Use right-angled triangle relationships to find sides and angles.", "Mensuration", "10", ["6.02", "8.03"]),
  topic("11.01", "Basic probability", "Use probability scales, sample spaces and relative frequency.", "Probability", "11", ["2.01", "2.02"]),
  topic("11.02", "Combined events", "Use diagrams and rules to calculate probabilities of combined events.", "Probability", "11", ["11.01"]),
  topic("11.03", "Conditional probability", "Model how one event changes the probability of another.", "Probability", "11", ["11.02"]),
  topic("12.01", "Sampling", "Understand populations, samples, bias and reliable data collection.", "Statistics", "12"),
  topic("12.02", "Representing data", "Choose, create and interpret suitable tables, diagrams and charts.", "Statistics", "12", ["12.01"]),
  topic("12.03", "Averages and spread", "Calculate and compare measures of centre and spread.", "Statistics", "12", ["12.02"]),
  topic("12.04", "Interpreting distributions", "Use statistical representations to compare distributions and draw conclusions.", "Statistics", "12", ["12.02", "12.03"]),
];

export const curriculumPacks: CurriculumPack[] = [
  {
    key: "ocr-j277-v3.1",
    awardingBody: "OCR",
    qualification: "GCSE (9–1) Computer Science",
    specificationCode: "J277",
    version: "3.1",
    published: "May 2026",
    subject: "Computer Science",
    sourceUrl: "https://www.ocr.org.uk/images/558027-specification-gcse-computer-science-j277.pdf",
    topics: j277Topics,
  },
  {
    key: "ocr-j560-v2.0",
    awardingBody: "OCR",
    qualification: "GCSE (9–1) Mathematics",
    specificationCode: "J560",
    version: "2.0",
    published: "May 2026",
    subject: "Mathematics",
    sourceUrl: "https://www.ocr.org.uk/Images/168982-specification-gcse-mathematics.pdf",
    topics: j560Topics,
  },
];

export function findCurriculumPack(key?: string) {
  return curriculumPacks.find((pack) => pack.key === key);
}

export function findCurriculumTopic(packKey?: string, code?: string) {
  return findCurriculumPack(packKey)?.topics.find((item) => item.code === code);
}
