import { useState, useEffect, useCallback } from “react”;

const COLORS = {
bg: “#F5A623”,
bgDark: “#E8961A”,
black: “#1A1A1A”,
white: “#FAFAFA”,
blue: “#2B4FA3”,
red: “#D94432”,
green: “#5B8C3E”,
purple: “#7B3FA0”,
teal: “#2A8C8C”,
orange: “#E87A1A”,
pink: “#C94478”,
navy: “#1E3A5F”,
};

const HABIT_COLORS = [COLORS.blue, COLORS.red, COLORS.green, COLORS.purple, COLORS.teal, COLORS.orange, COLORS.pink, COLORS.navy];
const HABIT_ICONS = [“🏋️”, “📖”, “💧”, “🧘”, “🏃”, “💤”, “🥗”, “✍️”, “🎯”, “💊”, “🚶”, “🧠”];

const DEFAULT_HABITS = [
{ id: 1, name: “Exercise”, icon: “🏋️”, color: COLORS.blue, completedDates: [] },
{ id: 2, name: “Read 30min”, icon: “📖”, color: COLORS.red, completedDates: [] },
{ id: 3, name: “Drink Water”, icon: “💧”, color: COLORS.green, completedDates: [] },
{ id: 4, name: “Meditate”, icon: “🧘”, color: COLORS.purple, completedDates: [] },
{ id: 5, name: “Journal”, icon: “✍️”, color: COLORS.teal, completedDates: [] },
];

const getTodayStr = () => new Date().toISOString().split(“T”)[0];
const getDayName = (offset = 0) => {
const d = new Date();
d.setDate(d.getDate() + offset);
return d.toLocaleDateString(“en”, { weekday: “short” });
};
const getDateStr = (offset = 0) => {
const d = new Date();
d.setDate(d.getDate() + offset);
return d.toISOString().split(“T”)[0];
};

function TargetLogo({ size = 40 }) {
return (
<div style={{
width: size, height: size, borderRadius: “50%”,
background: COLORS.black, display: “flex”, alignItems: “center”, justifyContent: “center”,
border: `3px solid ${COLORS.white}`,
}}>
<div style={{
width: size * 0.6, height: size * 0.6, borderRadius: “50%”,
border: `3px solid ${COLORS.bg}`, display: “flex”, alignItems: “center”, justifyContent: “center”,
}}>
<div style={{
width: size * 0.25, height: size * 0.25, borderRadius: “50%”,
background: COLORS.bg,
}} />
</div>
</div>
);
}

function HabitCard({ habit, isCompleted, onToggle }) {
const [pressed, setPressed] = useState(false);
return (
<div
onClick={onToggle}
onMouseDown={() => setPressed(true)}
onMouseUp={() => setPressed(false)}
onMouseLeave={() => setPressed(false)}
style={{
background: isCompleted ? habit.color : COLORS.white,
border: `4px solid ${COLORS.black}`,
borderRadius: 0,
padding: “18px 16px”,
cursor: “pointer”,
transform: pressed ? “scale(0.95)” : isCompleted ? “scale(1)” : “scale(1)”,
transition: “all 0.15s cubic-bezier(.4,0,.2,1)”,
display: “flex”, flexDirection: “column”, alignItems: “center”, gap: 8,
position: “relative”,
boxShadow: isCompleted ? `6px 6px 0px ${COLORS.black}` : `4px 4px 0px ${COLORS.black}`,
userSelect: “none”,
minHeight: 100,
justifyContent: “center”,
}}
>
{isCompleted && (
<div style={{
position: “absolute”, top: 6, right: 8,
background: COLORS.black, color: COLORS.white,
width: 22, height: 22, borderRadius: “50%”,
display: “flex”, alignItems: “center”, justifyContent: “center”,
fontSize: 13, fontWeight: 900,
}}>✓</div>
)}
<span style={{ fontSize: 32, lineHeight: 1 }}>{habit.icon}</span>
<span style={{
fontSize: 11, fontWeight: 900, letterSpacing: 1,
textTransform: “uppercase”,
color: isCompleted ? COLORS.white : COLORS.black,
textAlign: “center”,
fontFamily: “‘Archivo Black’, sans-serif”,
}}>{habit.name}</span>
</div>
);
}

function StatCard({ icon, value, label, color }) {
return (
<div style={{
background: color, border: `4px solid ${COLORS.black}`,
padding: “18px 14px”, flex: 1, display: “flex”, flexDirection: “column”,
alignItems: “center”, gap: 4,
boxShadow: `4px 4px 0px ${COLORS.black}`,
}}>
<div style={{
width: 32, height: 32, borderRadius: “50%”,
background: COLORS.black, display: “flex”, alignItems: “center”, justifyContent: “center”,
marginBottom: 4,
}}>
<span style={{ fontSize: 16 }}>{icon}</span>
</div>
<span style={{
fontSize: 28, fontWeight: 900, color: COLORS.white,
fontFamily: “‘Archivo Black’, sans-serif”, lineHeight: 1,
}}>{value}</span>
<span style={{
fontSize: 9, fontWeight: 800, color: “rgba(255,255,255,0.85)”,
letterSpacing: 1.5, textTransform: “uppercase”,
fontFamily: “‘Archivo Black’, sans-serif”, textAlign: “center”,
}}>{label}</span>
</div>
);
}

function WeekStrip({ habits }) {
const today = getTodayStr();
return (
<div style={{
display: “flex”, gap: 6, justifyContent: “center”, padding: “0 4px”,
}}>
{Array.from({ length: 7 }, (_, i) => {
const dateStr = getDateStr(i - 6);
const dayName = getDayName(i - 6);
const isToday = dateStr === today;
const completedCount = habits.filter(h => h.completedDates.includes(dateStr)).length;
const ratio = habits.length > 0 ? completedCount / habits.length : 0;
return (
<div key={i} style={{
display: “flex”, flexDirection: “column”, alignItems: “center”, gap: 4, flex: 1,
}}>
<span style={{
fontSize: 10, fontWeight: 800, letterSpacing: 1,
color: isToday ? COLORS.black : “rgba(0,0,0,0.5)”,
fontFamily: “‘Archivo Black’, sans-serif”,
}}>{dayName.toUpperCase()}</span>
<div style={{
width: 32, height: 32, borderRadius: “50%”,
border: `3px solid ${COLORS.black}`,
background: isToday
? ratio >= 1 ? COLORS.green : ratio > 0 ? COLORS.blue : COLORS.white
: ratio >= 1 ? “rgba(91,140,62,0.6)” : ratio > 0 ? “rgba(43,79,163,0.4)” : “rgba(255,255,255,0.4)”,
display: “flex”, alignItems: “center”, justifyContent: “center”,
fontSize: 11, fontWeight: 900, color: COLORS.black,
fontFamily: “‘Archivo Black’, sans-serif”,
boxShadow: isToday ? `2px 2px 0px ${COLORS.black}` : “none”,
}}>{completedCount}</div>
</div>
);
})}
</div>
);
}

function StatsView({ habits }) {
const today = getTodayStr();
const completedToday = habits.filter(h => h.completedDates.includes(today)).length;

const last30 = Array.from({ length: 30 }, (_, i) => getDateStr(-i));
const totalCompletions = habits.reduce((sum, h) =>
sum + h.completedDates.filter(d => last30.includes(d)).length, 0
);
const possibleCompletions = habits.length * 30;
const overallRate = possibleCompletions > 0 ? Math.round((totalCompletions / possibleCompletions) * 100) : 0;

return (
<div style={{ display: “flex”, flexDirection: “column”, gap: 16 }}>
<h2 style={{
fontFamily: “‘Archivo Black’, sans-serif”, fontSize: 22,
textTransform: “uppercase”, letterSpacing: 2, color: COLORS.black, margin: 0,
textAlign: “center”,
}}>Statistics</h2>
<p style={{
fontFamily: “‘Archivo Black’, sans-serif”, fontSize: 10,
textTransform: “uppercase”, letterSpacing: 2, color: “rgba(0,0,0,0.6)”,
textAlign: “center”, margin: 0,
}}>Your performance overview</p>

```
  <div style={{
    background: COLORS.black, border: `4px solid ${COLORS.black}`,
    padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    boxShadow: `6px 6px 0px rgba(0,0,0,0.3)`,
  }}>
    <span style={{
      fontSize: 56, fontWeight: 900, color: COLORS.bg,
      fontFamily: "'Archivo Black', sans-serif", lineHeight: 1,
    }}>{overallRate}%</span>
    <span style={{
      fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.7)",
      letterSpacing: 2, textTransform: "uppercase",
      fontFamily: "'Archivo Black', sans-serif",
    }}>30-Day Completion Rate</span>
  </div>

  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {habits.map(h => {
      const count = h.completedDates.filter(d => last30.includes(d)).length;
      const pct = Math.round((count / 30) * 100);
      return (
        <div key={h.id} style={{
          background: COLORS.white, border: `3px solid ${COLORS.black}`,
          padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
          boxShadow: `3px 3px 0px ${COLORS.black}`,
        }}>
          <span style={{ fontSize: 22 }}>{h.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Archivo Black', sans-serif", fontSize: 12,
              textTransform: "uppercase", letterSpacing: 1, color: COLORS.black,
            }}>{h.name}</div>
            <div style={{
              height: 10, background: "#ddd", marginTop: 6, border: `2px solid ${COLORS.black}`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${pct}%`, background: h.color,
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
          <span style={{
            fontFamily: "'Archivo Black', sans-serif", fontSize: 16, color: h.color,
          }}>{pct}%</span>
        </div>
      );
    })}
  </div>
</div>
```

);
}

function ProfileView({ habits }) {
const totalAll = habits.reduce((s, h) => s + h.completedDates.length, 0);
const joined = “March 2026”;

return (
<div style={{ display: “flex”, flexDirection: “column”, gap: 16, alignItems: “center” }}>
<h2 style={{
fontFamily: “‘Archivo Black’, sans-serif”, fontSize: 22,
textTransform: “uppercase”, letterSpacing: 2, color: COLORS.black, margin: 0,
}}>Profile</h2>

```
  <div style={{
    width: 80, height: 80, borderRadius: "50%",
    background: COLORS.black, border: `4px solid ${COLORS.black}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `4px 4px 0px rgba(0,0,0,0.3)`,
  }}>
    <span style={{ fontSize: 36 }}>🎯</span>
  </div>

  <span style={{
    fontFamily: "'Archivo Black', sans-serif", fontSize: 18,
    textTransform: "uppercase", letterSpacing: 2, color: COLORS.black,
  }}>Habit Crusher</span>

  <div style={{ display: "flex", gap: 12, width: "100%" }}>
    <div style={{
      flex: 1, background: COLORS.blue, border: `3px solid ${COLORS.black}`,
      padding: 16, textAlign: "center",
      boxShadow: `3px 3px 0px ${COLORS.black}`,
    }}>
      <div style={{
        fontFamily: "'Archivo Black', sans-serif", fontSize: 28, color: COLORS.white,
      }}>{habits.length}</div>
      <div style={{
        fontFamily: "'Archivo Black', sans-serif", fontSize: 9,
        color: "rgba(255,255,255,0.8)", letterSpacing: 1, textTransform: "uppercase",
      }}>Habits</div>
    </div>
    <div style={{
      flex: 1, background: COLORS.green, border: `3px solid ${COLORS.black}`,
      padding: 16, textAlign: "center",
      boxShadow: `3px 3px 0px ${COLORS.black}`,
    }}>
      <div style={{
        fontFamily: "'Archivo Black', sans-serif", fontSize: 28, color: COLORS.white,
      }}>{totalAll}</div>
      <div style={{
        fontFamily: "'Archivo Black', sans-serif", fontSize: 9,
        color: "rgba(255,255,255,0.8)", letterSpacing: 1, textTransform: "uppercase",
      }}>Total Done</div>
    </div>
    <div style={{
      flex: 1, background: COLORS.purple, border: `3px solid ${COLORS.black}`,
      padding: 16, textAlign: "center",
      boxShadow: `3px 3px 0px ${COLORS.black}`,
    }}>
      <div style={{
        fontFamily: "'Archivo Black', sans-serif", fontSize: 28, color: COLORS.white,
      }}>{joined.split(" ")[0].slice(0, 3)}</div>
      <div style={{
        fontFamily: "'Archivo Black', sans-serif", fontSize: 9,
        color: "rgba(255,255,255,0.8)", letterSpacing: 1, textTransform: "uppercase",
      }}>Joined</div>
    </div>
  </div>

  <div style={{
    background: COLORS.black, padding: 20, width: "100%",
    boxSizing: "border-box", textAlign: "center",
    border: `3px solid ${COLORS.black}`,
    boxShadow: `4px 4px 0px rgba(0,0,0,0.3)`,
  }}>
    <span style={{
      fontFamily: "'Archivo Black', sans-serif", fontSize: 12,
      color: COLORS.bg, letterSpacing: 2, textTransform: "uppercase",
    }}>Keep crushing it! 💪</span>
  </div>
</div>
```

);
}

function AddHabitModal({ onAdd, onClose }) {
const [name, setName] = useState(””);
const [selectedIcon, setSelectedIcon] = useState(“🎯”);
const [selectedColor, setSelectedColor] = useState(COLORS.blue);

return (
<div style={{
position: “fixed”, inset: 0, background: “rgba(0,0,0,0.7)”,
display: “flex”, alignItems: “center”, justifyContent: “center”,
zIndex: 1000, padding: 20,
}} onClick={onClose}>
<div onClick={e => e.stopPropagation()} style={{
background: COLORS.bg, border: `4px solid ${COLORS.black}`,
padding: 24, width: “100%”, maxWidth: 360,
boxShadow: `8px 8px 0px ${COLORS.black}`,
}}>
<h3 style={{
fontFamily: “‘Archivo Black’, sans-serif”, fontSize: 18,
textTransform: “uppercase”, letterSpacing: 2, margin: “0 0 16px”,
color: COLORS.black,
}}>New Habit</h3>

```
    <input
      value={name}
      onChange={e => setName(e.target.value)}
      placeholder="Habit name..."
      maxLength={20}
      style={{
        width: "100%", padding: "12px 14px",
        border: `3px solid ${COLORS.black}`,
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 14, background: COLORS.white,
        outline: "none", boxSizing: "border-box",
        marginBottom: 14,
      }}
    />

    <div style={{ marginBottom: 14 }}>
      <span style={{
        fontFamily: "'Archivo Black', sans-serif", fontSize: 10,
        letterSpacing: 2, textTransform: "uppercase", color: COLORS.black,
      }}>Icon</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {HABIT_ICONS.map(icon => (
          <div
            key={icon}
            onClick={() => setSelectedIcon(icon)}
            style={{
              width: 40, height: 40,
              border: `3px solid ${selectedIcon === icon ? COLORS.black : "transparent"}`,
              background: selectedIcon === icon ? COLORS.white : "rgba(255,255,255,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, cursor: "pointer",
              boxShadow: selectedIcon === icon ? `2px 2px 0px ${COLORS.black}` : "none",
            }}
          >{icon}</div>
        ))}
      </div>
    </div>

    <div style={{ marginBottom: 20 }}>
      <span style={{
        fontFamily: "'Archivo Black', sans-serif", fontSize: 10,
        letterSpacing: 2, textTransform: "uppercase", color: COLORS.black,
      }}>Color</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {HABIT_COLORS.map(c => (
          <div
            key={c}
            onClick={() => setSelectedColor(c)}
            style={{
              width: 36, height: 36, background: c,
              border: `3px solid ${selectedColor === c ? COLORS.white : COLORS.black}`,
              cursor: "pointer",
              boxShadow: selectedColor === c ? `0 0 0 3px ${COLORS.black}` : "none",
            }}
          />
        ))}
      </div>
    </div>

    <div style={{ display: "flex", gap: 10 }}>
      <button
        onClick={onClose}
        style={{
          flex: 1, padding: "12px", border: `3px solid ${COLORS.black}`,
          background: COLORS.white, fontFamily: "'Archivo Black', sans-serif",
          fontSize: 12, letterSpacing: 1, textTransform: "uppercase",
          cursor: "pointer", fontWeight: 900,
        }}
      >Cancel</button>
      <button
        onClick={() => {
          if (name.trim()) {
            onAdd({ name: name.trim(), icon: selectedIcon, color: selectedColor });
          }
        }}
        style={{
          flex: 1, padding: "12px", border: `3px solid ${COLORS.black}`,
          background: COLORS.black, color: COLORS.bg,
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 12, letterSpacing: 1, textTransform: "uppercase",
          cursor: "pointer", fontWeight: 900,
          boxShadow: `3px 3px 0px rgba(0,0,0,0.3)`,
        }}
      >Add</button>
    </div>
  </div>
</div>
```

);
}

export default function HabitCrusher() {
const [habits, setHabits] = useState(DEFAULT_HABITS);
const [activeTab, setActiveTab] = useState(“habits”);
const [showAdd, setShowAdd] = useState(false);
const [loaded, setLoaded] = useState(false);

useEffect(() => {
(async () => {
try {
const res = await window.storage.get(“habits-data”);
if (res?.value) {
const parsed = JSON.parse(res.value);
if (Array.isArray(parsed) && parsed.length > 0) setHabits(parsed);
}
} catch {}
setLoaded(true);
})();
}, []);

useEffect(() => {
if (!loaded) return;
(async () => {
try {
await window.storage.set(“habits-data”, JSON.stringify(habits));
} catch {}
})();
}, [habits, loaded]);

const today = getTodayStr();
const completedToday = habits.filter(h => h.completedDates.includes(today)).length;

const getStreak = useCallback(() => {
let streak = 0;
for (let i = 0; i < 365; i++) {
const d = getDateStr(-i);
const allDone = habits.every(h => h.completedDates.includes(d));
if (allDone && habits.length > 0) streak++;
else if (i > 0) break;
else if (!allDone && i === 0) break;
}
return streak;
}, [habits]);

const toggleHabit = (id) => {
setHabits(prev => prev.map(h => {
if (h.id !== id) return h;
const done = h.completedDates.includes(today);
return {
…h,
completedDates: done
? h.completedDates.filter(d => d !== today)
: […h.completedDates, today],
};
}));
};

const addHabit = ({ name, icon, color }) => {
setHabits(prev => […prev, {
id: Date.now(),
name, icon, color,
completedDates: [],
}]);
setShowAdd(false);
};

const deleteHabit = (id) => {
setHabits(prev => prev.filter(h => h.id !== id));
};

const streak = getStreak();

const tabs = [
{ id: “habits”, icon: “▦”, label: “Habits” },
{ id: “stats”, icon: “▥”, label: “Stats” },
{ id: “profile”, icon: “◉”, label: “Profile” },
];

return (
<div style={{
minHeight: “100vh”, background: COLORS.bg,
fontFamily: “‘Archivo Black’, Arial Black, sans-serif”,
display: “flex”, flexDirection: “column”,
}}>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap" rel="stylesheet" />

```
  {/* Header */}
  <div style={{
    padding: "20px 20px 14px",
    display: "flex", alignItems: "center", gap: 14,
    borderBottom: `4px solid ${COLORS.black}`,
  }}>
    <TargetLogo size={42} />
    <h1 style={{
      margin: 0, fontSize: 24, letterSpacing: 3,
      textTransform: "uppercase", color: COLORS.black,
      fontFamily: "'Archivo Black', sans-serif",
    }}>Habit Crusher</h1>
  </div>

  {/* Tabs */}
  <div style={{
    display: "flex", borderBottom: `4px solid ${COLORS.black}`,
  }}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        style={{
          flex: 1, padding: "10px 0",
          background: activeTab === tab.id ? COLORS.red : "transparent",
          border: "none",
          borderRight: `2px solid ${COLORS.black}`,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 16, color: activeTab === tab.id ? COLORS.white : COLORS.black,
          transition: "all 0.15s",
        }}
      >
        <span style={{ fontSize: 20 }}>{tab.icon}</span>
      </button>
    ))}
  </div>

  {/* Content */}
  <div style={{
    flex: 1, padding: 16, overflowY: "auto",
    display: "flex", flexDirection: "column", gap: 16,
  }}>
    {activeTab === "habits" && (
      <>
        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <h2 style={{
            margin: 0, fontSize: 22, letterSpacing: 3,
            textTransform: "uppercase", color: COLORS.black,
            fontFamily: "'Archivo Black', sans-serif",
          }}>Your Habits</h2>
          <p style={{
            margin: "4px 0 0", fontSize: 10, letterSpacing: 2,
            textTransform: "uppercase", color: "rgba(0,0,0,0.6)",
            fontFamily: "'Archivo Black', sans-serif",
          }}>Crush your goals, one day at a time</p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: 10 }}>
          <StatCard icon={<TargetLogo size={18} />} value={`${completedToday}/${habits.length}`} label="Completed Today" color={COLORS.blue} />
          <StatCard icon="🔥" value={streak} label="Day Streak" color={COLORS.red} />
        </div>

        {/* Week Strip */}
        <div style={{
          background: COLORS.white, border: `3px solid ${COLORS.black}`,
          padding: 12,
          boxShadow: `3px 3px 0px ${COLORS.black}`,
        }}>
          <WeekStrip habits={habits} />
        </div>

        {/* Habits Grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}>
          {habits.map(h => (
            <div key={h.id} style={{ position: "relative" }}>
              <HabitCard
                habit={h}
                isCompleted={h.completedDates.includes(today)}
                onToggle={() => toggleHabit(h.id)}
              />
              <button
                onClick={(e) => { e.stopPropagation(); deleteHabit(h.id); }}
                style={{
                  position: "absolute", top: -8, left: -8,
                  width: 22, height: 22, borderRadius: "50%",
                  background: COLORS.red, border: `2px solid ${COLORS.black}`,
                  color: COLORS.white, fontSize: 12, fontWeight: 900,
                  cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  padding: 0, lineHeight: 1,
                }}
              >×</button>
            </div>
          ))}

          {/* Add Button */}
          <div
            onClick={() => setShowAdd(true)}
            style={{
              border: `4px dashed ${COLORS.black}`,
              padding: "18px 16px",
              cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
              minHeight: 100,
              opacity: 0.6,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
          >
            <span style={{
              fontSize: 32, lineHeight: 1, color: COLORS.black,
            }}>+</span>
            <span style={{
              fontSize: 10, fontWeight: 900, letterSpacing: 1,
              textTransform: "uppercase", color: COLORS.black,
              fontFamily: "'Archivo Black', sans-serif",
            }}>Add Habit</span>
          </div>
        </div>

        {completedToday === habits.length && habits.length > 0 && (
          <div style={{
            background: COLORS.green, border: `4px solid ${COLORS.black}`,
            padding: 20, textAlign: "center",
            boxShadow: `6px 6px 0px ${COLORS.black}`,
          }}>
            <span style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 16, color: COLORS.white,
              letterSpacing: 2, textTransform: "uppercase",
            }}>🎉 All habits crushed today!</span>
          </div>
        )}
      </>
    )}

    {activeTab === "stats" && <StatsView habits={habits} />}
    {activeTab === "profile" && <ProfileView habits={habits} />}
  </div>

  {showAdd && <AddHabitModal onAdd={addHabit} onClose={() => setShowAdd(false)} />}
</div>
```

);
}
