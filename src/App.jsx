import { useState, useEffect } from 'react'

function App() {
  const [meals, setMeals] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    const getMeals = async () => {
      try {
        const response = await fetch("https://api.freeapi.app/api/v1/public/meals", { signal: controller.signal })
        const data = await response.json()
        setMeals(data.data.data)
      }
      catch (error) {
        if (error.name === 'AbortError') return
        setError(error)
      }
    }

    getMeals()

    return () => controller.abort()

  }, [])

  const getIngredients = (meal) => {
    const ingredients = []
    let index = 1
    while (meal[`strIngredient${index}`]) {
      ingredients.push(
        <li key={index}>
          <span style={styles.measure}>{meal[`strMeasure${index}`]}</span>
          <span>{meal[`strIngredient${index}`]}</span>
        </li>
      )
      index++
    }
    return ingredients
  }

  return (
    <>
      {error && (
        <div style={styles.error}>
          ⚠️ Failed to load videos. Please try again.
        </div>
      )}
      <div style={styles.page}>
        <header style={styles.header}>
          <p style={styles.headerEyebrow}>✦ CURATED RECIPES ✦</p>
          <h1 style={styles.headerTitle}>Meal Recipes</h1>
          <p style={styles.headerSub}>Complete recipes with full ingredient breakdowns</p>
        </header>

        <main style={styles.grid}>
          {meals?.map((meal) => (
            <div key={meal.idMeal} style={styles.card}>
              {meal.strMealThumb && (
                <div style={styles.imgWrap}>
                  <img src={meal.strMealThumb} alt={meal.strMeal} style={styles.img} />
                  <div style={styles.imgOverlay} />
                </div>
              )}
              <div style={styles.cardBody}>
                <div style={styles.tags}>
                  <span style={styles.tag}>{meal.strCategory}</span>
                  {meal.strArea && <span style={{ ...styles.tag, ...styles.tagAlt }}>{meal.strArea}</span>}
                </div>
                <h3 style={styles.mealName}>{meal.strMeal}</h3>
                <p style={styles.ingredientsLabel}>Ingredients</p>
                <ol style={styles.list}>
                  {getIngredients(meal)}
                </ol>
              </div>
            </div>
          ))}
        </main>
      </div>
    </>
  )
}

const styles = {
  page: {
    background: '#0c0c0c',
    minHeight: '100vh',
    fontFamily: "'Georgia', serif",
    color: '#f0ebe0',
  },
  header: {
    textAlign: 'center',
    padding: '80px 24px 48px',
    borderBottom: '1px solid #2a2a2a',
    marginBottom: '48px',
  },
  headerEyebrow: {
    letterSpacing: '0.3em',
    fontSize: '11px',
    color: '#c9a84c',
    marginBottom: '16px',
    fontFamily: "'Georgia', serif",
  },
  headerTitle: {
    fontSize: 'clamp(40px, 6vw, 80px)',
    fontWeight: '400',
    margin: '0 0 16px',
    letterSpacing: '-0.02em',
    color: '#f0ebe0',
  },
  headerSub: {
    color: '#666',
    fontSize: '15px',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2px',
    padding: '0 24px 80px',
    maxWidth: '1700px',
    margin: '0 auto',
  },
  card: {
    background: '#111',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    border: '1px solid #1a1a1a',
  },
  imgWrap: {
    position: 'relative',
    aspectRatio: '4/3',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.5s ease',
  },
  imgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, #111 0%, transparent 60%)',
  },
  cardBody: {
    padding: '20px',
  },
  tags: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  tag: {
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: '#c9a84c',
    border: '1px solid #c9a84c44',
    padding: '3px 8px',
    textTransform: 'uppercase',
  },
  tagAlt: {
    color: '#888',
    border: '1px solid #33333388',
  },
  mealName: {
    fontSize: '20px',
    fontWeight: '400',
    margin: '0 0 20px',
    lineHeight: '1.3',
    color: '#f0ebe0',
  },
  ingredientsLabel: {
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#555',
    marginBottom: '12px',
  },
  list: {
    padding: '0 0 0 16px',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  measure: {
    color: '#c9a84c',
    marginRight: '8px',
    fontSize: '13px',
    fontStyle: 'italic',
  },
}

export default App