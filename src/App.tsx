import { useEffect, useRef, useState } from "react";

type Scene =
  | "intro"
  | "message"
  | "flower"
  | "flowerChoice"
  | "flowerThanks"
  | "dateStory"
  | "dateChoice"
  | "calendar"
  | "camera"
  | "preview"
  | "finish";

type IntroPhase = "black" | "hey" | "hey-up" | "message-1" | "message-2";

const days = Array.from({ length: 35 }, (_, index) => {
  const value = index - 4;
  return value > 0 && value <= 31 ? value : null;
});

function Calendar({ onPick }: { onPick: (day: number) => void }) {
  const [selected, setSelected] = useState<number>();

  return (
    <div className="calendar" aria-label="Choose a date">
      <div className="calendar-head">
        <button aria-label="Previous month">‹</button>
        <strong>February 2025</strong>
        <button aria-label="Next month">›</button>
      </div>
      <div className="week">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="days">
        {days.map((day, index) =>
          day ? (
            <button
              className={selected === day ? "selected" : ""}
              key={day}
              onClick={() => {
                setSelected(day);
                window.setTimeout(() => onPick(day), 450);
              }}
            >
              {day}
            </button>
          ) : (
            <span key={`blank-${index}`} />
          ),
        )}
      </div>
    </div>
  );
}

function Camera({ onCapture }: { onCapture: (image?: string) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (video.current) video.current.srcObject = stream;
      setActive(true);
    } catch {
      setError("Camera access was unavailable — you can still continue.");
    }
  }

  function capture() {
    const source = video.current;
    if (!source) return onCapture();
    const canvas = document.createElement("canvas");
    canvas.width = source.videoWidth;
    canvas.height = source.videoHeight;
    canvas.getContext("2d")?.drawImage(source, 0, 0);
    source.srcObject &&
      (source.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    onCapture(canvas.toDataURL("image/jpeg", 0.88));
  }

  return (
    <div className="camera-panel">
      {active ? (
        <>
          <video ref={video} autoPlay playsInline muted />
          <button className="shutter" aria-label="Take photo" onClick={capture} />
        </>
      ) : (
        <button className="camera-button" onClick={startCamera}>
          <img src="/assets/792eb.svg" alt="" />
          <span>Open camera</span>
        </button>
      )}
      {error && (
        <button className="camera-error" onClick={() => onCapture()}>
          {error}
        </button>
      )}
    </div>
  );
}

export default function App() {
  const [scene, setScene] = useState<Scene>("intro");
  const [introPhase, setIntroPhase] = useState<IntroPhase>("black");
  const [messageStep, setMessageStep] = useState(0);
  const [rejectNote, setRejectNote] = useState("");
  const [photo, setPhoto] = useState<string>();

  useEffect(() => {
    if (scene !== "intro") return;

    const timers: number[] = [];

    // Phase 1: Black screen for 0.8s, then "hey" appears
    timers.push(
      window.setTimeout(() => setIntroPhase("hey"), 800)
    );

    // Phase 2: After 1s more (1.8s total), "hey" moves up, message-1 slides in
    timers.push(
      window.setTimeout(() => setIntroPhase("hey-up"), 1800)
    );

    // Phase 3: After 4.5s total, message changes to message-2
    timers.push(
      window.setTimeout(() => setIntroPhase("message-2"), 4500)
    );

    // Phase 4: After message-2 shows for a bit, transition to flower scene
    timers.push(
      window.setTimeout(() => setScene("flower"), 7000)
    );

    return () => timers.forEach(t => window.clearTimeout(t));
  }, [scene]);

  // Keep the existing message/flower/etc scene transitions
  useEffect(() => {
    if (scene === "message" && messageStep < 3) {
      const timer = window.setTimeout(() => setMessageStep((step) => step + 1), 1900);
      return () => window.clearTimeout(timer);
    }
    if (scene === "message" && messageStep === 3) {
      const timer = window.setTimeout(() => setScene("flower"), 2200);
      return () => window.clearTimeout(timer);
    }
    if (scene === "flower") {
      const timer = window.setTimeout(() => setScene("flowerChoice"), 2800);
      return () => window.clearTimeout(timer);
    }
    if (scene === "flowerThanks") {
      const timer = window.setTimeout(() => setScene("dateStory"), 2600);
      return () => window.clearTimeout(timer);
    }
    if (scene === "dateStory") {
      const timer = window.setTimeout(() => setScene("dateChoice"), 4200);
      return () => window.clearTimeout(timer);
    }
  }, [scene, messageStep]);

  const hasRose = !["intro", "message"].includes(scene);
  const showNames = ["dateStory", "dateChoice", "calendar", "camera", "preview"].includes(scene);

  return (
    <main className={`app ${hasRose ? "with-rose" : ""}`}>
      <img className="paper" src="/assets/e8091.png" alt="" />
      {hasRose && <img className="rose" src="/assets/41c37.png" alt="" />}
      {showNames && (
        <div className="names" aria-hidden="true">
          <span>Mi Panda</span>
          <span>Wubalem</span>
          <span>Aqomash</span>
        </div>
      )}

      <section className="content" aria-live="polite">
        {scene === "intro" && (
          <div className="intro-sequence">
            {introPhase === "black" && <div className="black-overlay" />}
            <h1 className={`hey ${introPhase === "hey-up" ? "hey-up" : ""}`}>
              {introPhase === "hey-up" || introPhase === "message-1" || introPhase === "message-2" ? "hey" : "HEY!"}
            </h1>
            <div className="intro-message">
              <p className={introPhase === "message-1" || introPhase === "message-2" ? "visible" : ""}>
                Sooo, i thought about making this gift/design or bcha mnm beyw
              </p>
              <p className={introPhase === "message-2" ? "visible" : ""}>
                Bcuz i like doing things abt u and also with u
              </p>
            </div>
          </div>
        )}

        {scene === "message" && (
          <div className="story">
            <p className={messageStep === 0 ? "visible" : ""}>
              Sooo, i thought about making this gift/design or bcha mnm beyw
            </p>
            <p className={messageStep === 1 ? "visible" : ""}>
              Bcuz i like doing things abt u and also with u
            </p>
            <p className={messageStep === 2 ? "visible" : ""}>
              andddd yes, bcuz i couldnt get flowers ezi kababi
            </p>
            <p className={messageStep === 3 ? "visible" : ""}>
              Overall, i was really happy making it, and i hope you will love it
            </p>
          </div>
        )}

        {scene === "flower" && (
          <div className="reveal">
            <p>WAITTTTTTTTTTT</p>
            <p>Did I say Flower?</p>
            <p>Oh, yes!</p>
          </div>
        )}

        {scene === "flowerChoice" && (
          <div className="choice flower-choice">
            <div className="button-row">
              <button className="yes" onClick={() => setScene("flowerThanks")}>Accept</button>
              <button
                className="no"
                onClick={() => setRejectNote("u thought i will make it this is for you huh?")}
              >
                Reject
              </button>
            </div>
            {rejectNote && <p className="note">{rejectNote}</p>}
          </div>
        )}

        {scene === "flowerThanks" && (
          <div className="big-message">
            <p>owww</p>
            <p>you actually accepted<br />my flower</p>
            <p>am veryyyy happy</p>
          </div>
        )}

        {scene === "dateStory" && (
          <p className="date-story">
            I was thinking abt our next week date, ena balefew bedereku and dnget
            yeteyekush meselegn, so i thought why not be creative abt it and ask
            her bezi menged, cuz u are the most exciting thing that is happening
            to me recently<br /><br />and am lovingg it that way!
          </p>
        )}

        {scene === "dateChoice" && (
          <div className="choice date-choice">
            <h2>Would go out on a<br />date with me?</h2>
            <div className="button-row">
              <button className="yes" onClick={() => setScene("calendar")}>Okay</button>
              <button
                className="no"
                onClick={() =>
                  setRejectNote(
                    "err besmeab — creative lhun balku lene yhe ygebal? aydebam, nooo!",
                  )
                }
              >
                Nope
              </button>
            </div>
            {rejectNote && <p className="note">{rejectNote}</p>}
          </div>
        )}

        {scene === "calendar" && (
          <div className="calendar-scene">
            <h2>Pick a day?</h2>
            <Calendar onPick={() => setScene("camera")} />
          </div>
        )}

        {scene === "camera" && (
          <div className="camera-scene">
            <p>this would be lovely<br />touch the camera below</p>
            <Camera
              onCapture={(image) => {
                setPhoto(image);
                setScene("preview");
                window.setTimeout(() => setScene("finish"), 2800);
              }}
            />
          </div>
        )}

        {scene === "preview" && (
          <div className="preview">
            {photo && <img src={photo} alt="Your captured selfie" />}
            <p>owww look at this lovely elegant lady<br />miss u already</p>
          </div>
        )}

        {scene === "finish" && (
          <div className="finish">
            <p>I hope this makes me<br />closer to your heart than<br />ever</p>
            <p>We are done here!<br />Thank you wubalem!</p>
          </div>
        )}
      </section>
    </main>
  );
}
