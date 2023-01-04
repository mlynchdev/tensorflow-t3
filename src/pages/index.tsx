import { type NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import * as toxicity from "@tensorflow-models/toxicity";
import { api } from "../utils/api";

const threshold = 0.5;
const ListItem = ({ data, sentence }) => {
  const stringifiedData = JSON.stringify(data, null, 2);
  return (
    <>
      <h2>{sentence}</h2>
      <div>{stringifiedData}</div>
    </>
  );
};
const Home: NextPage = () => {
  const [statements, setStatements] = useState(null);
  const [sentences, setSentences] = useState([
    "You are a poopy head!",
    "I like turtles",
    "Shut up!",
  ]);
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  toxicity.load(threshold).then((model) => {
    model.classify(sentences).then((predictions) => {
      // semi-pretty-print results
      setStatements(predictions);
    });
  });
  if (!statements) return;
  const list = statements.map((statement, idx) => {
    if (idx === 0) console.log(statement);
    return (
      <ListItem
        key={`${idx}-${statement.name}`}
        sentence={sentences[idx]}
        data={statement.results}
      />
    );
  });
  return (
    <>
      <Head>
        <title>TFJS with T3-App</title>
        <meta name="description" content="TensorFlowJS toxicity experiment" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Unlock{" "}
            <span className="text-[hsl(280,100%,70%)]">Tensor Flow JS</span>
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {list}
          </div>
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
