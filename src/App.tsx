import { CSSEasing } from "./components/CSSEasing";
import { Header } from "./components/header";
import { SpringEasing } from "./components/SpringEasing";
import { CSS_EASINGS } from "./lib/css-easings";
import { DURATION_TOKEN } from "./lib/duration-tokens";
import { SPRING_CONFIGS } from "./lib/spring-easings";

function App() {
  return (
    <div className="max-w-5xl mx-auto px-4 pb-10">
      <Header />
      <div className="flex flex-col gap-4 my-12">
        <h1 className="text-3xl font-bold">Motion System</h1>
        <p className="font-base max-w-2/3">
          Хорошая анимация ощущается естественной и предсказуемой. Ключевое
          отличие между роботичной и приятной анимацией скрывается в
          изингах(типах сглаживания) и таймингах — линейные переходы выглядят
          искусственно, поскольку в реальном мире почти ничто не движется с
          постоянной скоростью. Вместо этого следует использовать кривые типа
          ease-in-out/spring, которые имитируют естественное ускорение и
          замедление, как у автомобиля при разгоне и торможении.
        </p>
        <p className="font-base max-w-2/3">
          Анимация должна иметь смысл и логически связывать действия с их
          последствиями. Не стоит анимировать все подряд — каждое движение
          должно быть оправдано и понятно пользователю.
        </p>
        <p className="font-base max-w-2/3">
          На этой странице представлены основные типы и правила, которые помогут
          создать хорошие и приятные анимации при разработке.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Duration tokens</h2>
          <p className="font-base max-w-2/3">
            <ul className="flex flex-col gap-2">
              {Object.entries(DURATION_TOKEN).map(([token, value]) => {
                // Map of token descriptions
                const descriptions: Record<string, string> = {
                  "duration-50": "микро-интеракции, нажатия кнопок",
                  "duration-100": "ховеры",
                  "duration-200": "ховеры, легкие переходы, нажатия кнопок",
                  "duration-400":
                    "и до 300ms: открытия модальных окон, появления элементов",
                  "duration-800": "переходы страниц",
                };

                return (
                  <li key={token}>
                    <span className="font-mono text-sm p-1 rounded bg-gray-200">
                      {token}
                    </span>
                    : {value} ms{" "}
                    {descriptions[token] ? `(${descriptions[token]})` : ""}
                  </li>
                );
              })}
            </ul>
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">CSS easings</h2>
          <p className="font-base max-w-2/3">
            В 90% случаев используем ease-out, с затуханием анимации в конце. В
            некоторых ситуциях используем ease-in, например, когда у нас
            анимация “исчезновения” элемента из поля видимости. Чаще всего
            используем `easeOut` интерполяцию для анимаций появления и
            исчезновения элементов. Ускорение в начале дает пользователю
            ощущение отзывчивости. Длительность анимации не больше 300/400 MS.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CSS_EASINGS.map((item, index) => (
              <CSSEasing key={`css-easing-${index}`} easing={item} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Spring easings</h2>
          <p className="font-base max-w-2/3">
            Баунс интерполяция имеет несколько плюсов: она более
            органичная(physics-based), она необязательно зависит от длительности
            анимации. С ее помощью можно получать ios-like анимацию.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SPRING_CONFIGS.map((item, index) => (
              <SpringEasing key={`spring-easing-${index}`} config={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
