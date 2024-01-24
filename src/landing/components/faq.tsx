import { Container } from "~/landing/components/container";
import { Env } from "~/lib/Env";

const questions = [
  {
    question: "O que é o racha aí?",
    answer:
      "O racha aí é o app para divisão de contas, sem a necessidade de cadastrar contas bancárias, cartões de crédito ou deixar dinheiro no app. Sem nenhuma amarra.",
  },
  {
    question: "Porque usar o racha aí?",
    answer:
      "O racha aí é pensado para auxiliar na divisão de contas, separando o pagamento por produto por pessoa. O que ajuda a evitar prejuízos ou contas injustas.",
  },
  {
    question: "Onde posso usar o aplicativo",
    answer:
      "Por enquanto o racha aí é apenas um site, sendo necessário usar através de um navegador. Seja do seu smartphone ou computador. Ainda não há sincronia entre os dispositivos, estamos trabalhando nisso.",
  },
  {
    question: "Todos os meus amigos precisam ter conta para usar o app?",
    answer:
      "Não, apenas uma pessoa pode ter a conta e controlar os gastos do grupo, sendo a responsável por anotar os gastos e informar os valores.",
  },
  {
    question: "Posso usar o app sem nenhum grupo ou amigos cadastrados?",
    answer:
      "Sim, o racha aí foi feito para auxiliar no gerenciamento de custos, seja sozinho ou com a galera.",
  },
];

export function Faq() {
  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="border-t border-gray-200 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faqs-title"
            className="text-3xl font-medium tracking-tight text-gray-900"
          >
            Dúvidas? Nós respondemos
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            <a
              href={`mailto:${Env.ownerEmail}`}
              className="text-gray-900 underline"
            >
              Ou envie um email.
            </a>
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {questions.map((faq) => (
            <li key={faq.question}>
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                {faq.question}
              </h3>
              <p className="mt-4 text-sm text-gray-700">{faq.answer}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
