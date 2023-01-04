import { type NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import * as toxicity from "@tensorflow-models/toxicity";
import { api } from "../utils/api";
import { div } from "@tensorflow/tfjs";

const threshold = 0.5;
const ListItem = ({ data, sentences }) => {
  const { label, results } = data;
  // creates a card for each toxicity label with a list of sentences that match that label
  // indicates whether the sentence is toxic with red X or green checkmark
  const sentenceList = results.map((result, idx) => {
    return (
      <div key={idx} className="mb-1 flex items-center justify-start">
        <span className="mr-6 text-3xl">{sentences[idx]}</span>
        {result.match ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-red-600 font-bold">
            X
          </span>
        ) : (
          <span className="flex h-6 w-6 rounded-full border-2 border-black bg-green-600 "></span>
        )}
      </div>
    );
  });

  return (
    <>
      <div className="container mb-3 rounded-lg bg-white bg-opacity-75 py-3 px-3">
        <h1 className="flex flex-col gap-4 ">{label}</h1>
        <div className="mb-10 ">{sentenceList}</div>
      </div>
    </>
  );
};

const Home: NextPage = () => {
  const [statements, setStatements] = useState(null);
  const [sentences, setSentences] = useState(["I'm horny!"]);
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  useEffect(() => {
    if (!statements) {
      toxicity.load(threshold).then((model) => {
        model.classify(sentences).then((predictions) => {
          // semi-pretty-print results
          setStatements(predictions);
        });
      });
    }
  }, []);
  if (!statements) return;

  const list = statements.map((statement, idx) => {
    return (
      <>
        <ListItem
          key={`${idx}-${statement.name}`}
          sentences={sentences}
          data={statement}
        />
      </>
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
          <div className="flex  flex-col">{list}</div>
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
