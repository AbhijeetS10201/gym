// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.workoutExercise.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.gymLocation.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.plan.deleteMany();

  console.log('Seeding subscription plans...');
  const plans = [
    {
      name: 'Silver Plan',
      slug: 'silver-plan',
      price: 999,
      duration: 1,
      tier: 'SILVER',
      description: 'Access to your home gym location with all basic facilities.',
      features: JSON.stringify([
        'Access to home gym location',
        'Basic workout planner tools',
        'Standard equipment access',
        'Free Wi-Fi access'
      ]),
      popular: false,
      active: true,
    },
    {
      name: 'Gold Plan',
      slug: 'gold-plan',
      price: 1999,
      duration: 1,
      tier: 'GOLD',
      description: 'Popular choice. Access to any gym franchise in India with group classes.',
      features: JSON.stringify([
        'Access to all gym locations across India',
        'All standard features',
        'Access to group classes',
        'Progress tracking charts',
        '1 complimentary personal trainer assessment'
      ]),
      popular: true,
      active: true,
    },
    {
      name: 'Platinum Plan',
      slug: 'platinum-plan',
      price: 3499,
      duration: 1,
      tier: 'PLATINUM',
      description: 'The ultimate fitness package including personal trainers and custom nutrition.',
      features: JSON.stringify([
        'Access to all gym locations across India',
        '4 personal trainer sessions per month',
        'Customized nutrition & diet plans',
        'Priority booking for premium classes',
        'Free access to healthy shake bar (1/day)',
        'Exclusive locker room access'
      ]),
      popular: false,
      active: true,
    }
  ];

  const createdPlans = [];
  for (const plan of plans) {
    const created = await prisma.plan.create({ data: plan });
    createdPlans.push(created);
  }
  console.log(`Seeded ${createdPlans.length} plans.`);

  console.log('Seeding exercises...');
  const exercisesData = [
    // Chest
    {
      name: 'Bench Press',
      slug: 'bench-press',
      muscleGroup: 'Chest',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: 'Lie flat on a bench. Grip the barbell slightly wider than shoulder-width. Lower the bar slowly to your chest, then push it back up explosively while keeping your feet flat on the floor.',
      tips: JSON.stringify([
        'Keep your shoulder blades retracted and down.',
        'Do not bounce the bar off your chest.',
        'Control the descent to protect your shoulders.'
      ]),
    },
    {
      name: 'Incline Dumbbell Press',
      slug: 'incline-dumbbell-press',
      muscleGroup: 'Chest',
      equipment: 'Dumbbells',
      difficulty: 'Intermediate',
      instructions: 'Set the bench to a 30-45 degree incline. Sit back with a dumbbell in each hand. Press the weights up over your chest, bringing them close together at the top, then lower them under control.',
      tips: JSON.stringify([
        'Focus on the upper chest contraction at the top.',
        'Keep your wrists straight and elbow joints aligned.',
        'Avoid locking your elbows completely at the top.'
      ]),
    },
    {
      name: 'Cable Crossover',
      slug: 'cable-crossover',
      muscleGroup: 'Chest',
      equipment: 'Cable Machine',
      difficulty: 'Intermediate',
      instructions: 'Place pulleys at high positions. Grab handles and step forward in the center. Lean slightly forward. Bring your hands down and forward in a wide arc until they meet in front of your waist.',
      tips: JSON.stringify([
        'Keep a slight bend in your elbows throughout.',
        'Squeeze your chest muscles at the peak contraction.',
        'Control the weights on the return phase.'
      ]),
    },
    // Back
    {
      name: 'Pull-Ups',
      slug: 'pull-ups',
      muscleGroup: 'Back',
      equipment: 'Pull-up Bar',
      difficulty: 'Advanced',
      instructions: 'Grasp the pull-up bar with an overhand grip, hands wider than shoulder-width. Pull your body up until your chin clears the bar, focusing on driving your elbows down. Lower slowly.',
      tips: JSON.stringify([
        'Engage your core to prevent swinging.',
        'Ensure full range of motion at the bottom (dead hang).',
        'Lead with your chest as you pull up.'
      ]),
    },
    {
      name: 'Barbell Row',
      slug: 'barbell-row',
      muscleGroup: 'Back',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: 'Hinge at your hips with a flat back, knees slightly bent. Hold the barbell with an overhand grip. Pull the bar to your lower ribcage, squeezing your shoulder blades together at the top.',
      tips: JSON.stringify([
        'Keep your spine neutral; do not round your back.',
        'Pull with your elbows, not your hands.',
        'Keep your neck aligned with your spine.'
      ]),
    },
    {
      name: 'Lat Pulldown',
      slug: 'lat-pulldown',
      muscleGroup: 'Back',
      equipment: 'Cable Machine',
      difficulty: 'Beginner',
      instructions: 'Sit at a lat pulldown station. Grab the bar with a wide overhand grip. Pull the bar down to your upper chest while leaning back slightly. Return to starting position slowly.',
      tips: JSON.stringify([
        'Do not pull the bar behind your neck.',
        'Focus on pulling with your latissimus dorsi (back) muscles.',
        'Control the weight as it rises.'
      ]),
    },
    // Shoulders
    {
      name: 'Overhead Press',
      slug: 'overhead-press',
      muscleGroup: 'Shoulders',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: 'Stand straight, holding a barbell at shoulder height. Press the bar overhead until your arms are fully locked out. Keep your core tight and avoid leaning back.',
      tips: JSON.stringify([
        'Squeeze your glutes and brace your core for stability.',
        'Move your head back slightly as the bar passes your face.',
        'Lock your elbows out at the top.'
      ]),
    },
    {
      name: 'Lateral Raise',
      slug: 'lateral-raise',
      muscleGroup: 'Shoulders',
      equipment: 'Dumbbells',
      difficulty: 'Beginner',
      instructions: 'Stand holding dumbbells at your sides. Keeping a slight bend in your elbows, raise the weights out to your sides until they reach shoulder height. Lower them slowly.',
      tips: JSON.stringify([
        'Lead the movement with your elbows.',
        'Avoid swinging the body to lift the weight.',
        'Keep your hands slightly tilted (like pouring water) at the top.'
      ]),
    },
    {
      name: 'Face Pulls',
      slug: 'face-pulls',
      muscleGroup: 'Shoulders',
      equipment: 'Cable Machine',
      difficulty: 'Beginner',
      instructions: 'Set cable pulley to upper chest height with rope attachment. Hold ends of rope. Pull the center of the rope towards your nose, pulling your hands apart beside your ears. Squeeze rear delts.',
      tips: JSON.stringify([
        'Focus on external rotation of the shoulders at the end.',
        'Keep the movement slow and deliberate.',
        'Highly recommended for posture improvement.'
      ]),
    },
    // Arms
    {
      name: 'Bicep Curl',
      slug: 'bicep-curl',
      muscleGroup: 'Arms',
      equipment: 'Dumbbells',
      difficulty: 'Beginner',
      instructions: 'Stand holding dumbbells with palms facing forward. Keep your elbows tucked close to your torso. Flex your elbows and curl the weights up, squeezing your biceps. Lower slowly.',
      tips: JSON.stringify([
        'Keep your elbows static; do not let them swing forward.',
        'Get a full stretch at the bottom.',
        'Avoid using momentum.'
      ]),
    },
    {
      name: 'Hammer Curl',
      slug: 'hammer-curl',
      muscleGroup: 'Arms',
      equipment: 'Dumbbells',
      difficulty: 'Beginner',
      instructions: 'Stand holding dumbbells with a neutral grip (palms facing each other). Curl the weights up while keeping your palms facing each other. Squeeze the outer arms. Lower under control.',
      tips: JSON.stringify([
        'Targets the brachialis and brachioradialis.',
        'Maintain a strong wrist alignment throughout.',
        'Do not rock your hips.'
      ]),
    },
    {
      name: 'Tricep Pushdown',
      slug: 'tricep-pushdown',
      muscleGroup: 'Arms',
      equipment: 'Cable Machine',
      difficulty: 'Beginner',
      instructions: 'Hold a cable bar or rope attachment with elbows tucked at 90 degrees. Push down extending your elbows fully, squeezing the back of your arms. Return to starting position.',
      tips: JSON.stringify([
        'Keep your elbows locked in place near your ribs.',
        'Do not lean over the bar too much.',
        'Control the negative tempo.'
      ]),
    },
    {
      name: 'Overhead Tricep Extension',
      slug: 'overhead-tricep-extension',
      muscleGroup: 'Arms',
      equipment: 'Dumbbells',
      difficulty: 'Intermediate',
      instructions: 'Hold a dumbbell with both hands overhead. Keeping your upper arms vertical and close to your ears, bend your elbows to lower the weight behind your head, then press it back up.',
      tips: JSON.stringify([
        'Keep your elbows pointing forward, not flaring out.',
        'Engage your abs to protect your lower back.',
        'Ensure full range of motion.'
      ]),
    },
    // Legs
    {
      name: 'Barbell Squat',
      slug: 'barbell-squat',
      muscleGroup: 'Legs',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: 'Rest a barbell on your upper back. Stand with feet shoulder-width apart. Squat down by pushing your hips back and bending your knees, keeping chest high. Push back up to stand.',
      tips: JSON.stringify([
        'Keep your knees tracking in line with your toes.',
        'Squat until thighs are parallel to the floor or lower.',
        'Maintain a tight upper back and straight spine.'
      ]),
    },
    {
      name: 'Romanian Deadlift',
      slug: 'romanian-deadlift',
      muscleGroup: 'Legs',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: 'Stand holding a barbell. Hinge at your hips, sending them backward while keeping your back completely flat. Lower the bar along your legs until you feel a stretch in hamstrings, then return.',
      tips: JSON.stringify([
        'Keep a very soft bend in your knees (not bent, not locked).',
        'Keep the bar scraping down your thighs.',
        'Squeeze your glutes at the top.'
      ]),
    },
    {
      name: 'Leg Press',
      slug: 'leg-press',
      muscleGroup: 'Legs',
      equipment: 'Leg Press Machine',
      difficulty: 'Beginner',
      instructions: 'Sit in leg press machine, feet shoulder-width on sled. Release locks, lower the sled slowly until knees are at 90 degrees. Press the sled back up explosively without locking knees.',
      tips: JSON.stringify([
        'Never lock your knees out at the top.',
        'Keep your lower back pressed firmly against the seat.',
        'Do not let your butt lift off the pad.'
      ]),
    },
    {
      name: 'Leg Curl',
      slug: 'leg-curl',
      muscleGroup: 'Legs',
      equipment: 'Leg Curl Machine',
      difficulty: 'Beginner',
      instructions: 'Lie or sit at the leg curl machine. Place the pad behind your lower legs. Curl your legs backwards towards your glutes. Hold for a second, then return to starting position.',
      tips: JSON.stringify([
        'Squeeze hamstrings at the end of the motion.',
        'Keep your ankles flexed.',
        'Avoid lifting your hips off the bench.'
      ]),
    },
    // Core
    {
      name: 'Planks',
      slug: 'planks',
      muscleGroup: 'Core',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      instructions: 'Get into a pushup position but rest your weight on your forearms. Keep your body in a straight line from head to heels, bracing your core and glutes. Hold this position.',
      tips: JSON.stringify([
        'Do not let your hips sag or hike up.',
        'Keep your neck in a neutral alignment.',
        'Breathe continuously.'
      ]),
    },
    {
      name: 'Hanging Leg Raise',
      slug: 'hanging-leg-raise',
      muscleGroup: 'Core',
      equipment: 'Pull-up Bar',
      difficulty: 'Advanced',
      instructions: 'Hang from a bar. Keeping your legs straight, raise them until they are parallel to the floor. Lower them slowly, avoiding any swinging motions.',
      tips: JSON.stringify([
        'Control the descent to engage lower abs.',
        'Use straps if your grip strength limits you.',
        'If too hard, perform bent-knee raises instead.'
      ]),
    },
    {
      name: 'Cable Crunch',
      slug: 'cable-crunch',
      muscleGroup: 'Core',
      equipment: 'Cable Machine',
      difficulty: 'Intermediate',
      instructions: 'Kneel in front of a cable machine with rope. Hold rope beside your ears. Crunch down, pulling your elbows towards your thighs, flexing your spine. Return under control.',
      tips: JSON.stringify([
        'Do not pull with your arms; flex your core.',
        'Keep your hips static; do not sit back.',
        'Exhale as you crunch.'
      ]),
    },
    // Full Body
    {
      name: 'Burpees',
      slug: 'burpees',
      muscleGroup: 'Full Body',
      equipment: 'Bodyweight',
      difficulty: 'Intermediate',
      instructions: 'From standing, drop into a squat, kick feet back into a push-up position, perform a push-up, jump feet back to squat, then jump up into the air reaching overhead.',
      tips: JSON.stringify([
        'Land softly on your feet during the jump.',
        'Maintain pace to build cardiovascular endurance.',
        'Keep your core tight during the push-up phase.'
      ]),
    },
    {
      name: 'Kettlebell Swing',
      slug: 'kettlebell-swing',
      muscleGroup: 'Full Body',
      equipment: 'Kettlebell',
      difficulty: 'Intermediate',
      instructions: 'Hinge forward at the hips, hold kettlebell with both hands. Swing the bell back between your legs, then drive your hips forward to swing the bell to chest level. Hinge back down.',
      tips: JSON.stringify([
        'This is a hip hinge, not a squat.',
        'Drive the weight using your hamstrings and glutes.',
        'Keep your spine completely flat.'
      ]),
    }
  ];

  const createdExercises: Record<string, any> = {};
  for (const ex of exercisesData) {
    const created = await prisma.exercise.create({ data: ex });
    createdExercises[ex.slug] = created;
  }
  console.log(`Seeded ${Object.keys(createdExercises).length} exercises.`);

  console.log('Seeding workout plans and linking exercises...');
  const workoutPlansData = [
    {
      name: 'Full Body Blast',
      slug: 'full-body-blast',
      category: 'Strength & Conditioning',
      difficulty: 'Intermediate',
      duration: 45,
      calories: 400,
      description: 'A high-intensity full-body routine designed to maximize calorie burn and target all major muscle groups.',
      featured: true,
      exercises: [
        { slug: 'barbell-squat', sets: 4, reps: '10', restSeconds: 90, order: 1 },
        { slug: 'barbell-row', sets: 3, reps: '10', restSeconds: 60, order: 2 },
        { slug: 'bench-press', sets: 3, reps: '10', restSeconds: 60, order: 3 },
        { slug: 'overhead-press', sets: 3, reps: '12', restSeconds: 60, order: 4 },
        { slug: 'planks', sets: 3, reps: '60s hold', restSeconds: 45, order: 5 }
      ]
    },
    {
      name: 'Upper Body Power',
      slug: 'upper-body-power',
      category: 'Hypertrophy',
      difficulty: 'Advanced',
      duration: 60,
      calories: 450,
      description: 'Sculpt your chest, back, shoulders, and arms with this heavy-lifting strength builder.',
      featured: false,
      exercises: [
        { slug: 'bench-press', sets: 4, reps: '8', restSeconds: 90, order: 1 },
        { slug: 'pull-ups', sets: 4, reps: 'to failure', restSeconds: 90, order: 2 },
        { slug: 'incline-dumbbell-press', sets: 3, reps: '10', restSeconds: 60, order: 3 },
        { slug: 'barbell-row', sets: 3, reps: '10', restSeconds: 60, order: 4 },
        { slug: 'overhead-press', sets: 3, reps: '8', restSeconds: 60, order: 5 },
        { slug: 'bicep-curl', sets: 3, reps: '12', restSeconds: 45, order: 6 },
        { slug: 'tricep-pushdown', sets: 3, reps: '12', restSeconds: 45, order: 7 }
      ]
    },
    {
      name: 'Leg Day Destroyer',
      slug: 'leg-day-destroyer',
      category: 'Hypertrophy',
      difficulty: 'Intermediate',
      duration: 50,
      calories: 500,
      description: 'Build serious power and definition in your quads, hamstrings, and glutes with this challenging leg routine.',
      featured: true,
      exercises: [
        { slug: 'barbell-squat', sets: 4, reps: '8', restSeconds: 120, order: 1 },
        { slug: 'romanian-deadlift', sets: 4, reps: '10', restSeconds: 90, order: 2 },
        { slug: 'leg-press', sets: 3, reps: '12', restSeconds: 60, order: 3 },
        { slug: 'leg-curl', sets: 3, reps: '15', restSeconds: 45, order: 4 }
      ]
    },
    {
      name: 'Push Day',
      slug: 'push-day',
      category: 'Strength & Hypertrophy',
      difficulty: 'Intermediate',
      duration: 55,
      calories: 380,
      description: 'Focused pushes focusing entirely on chest, shoulders, and triceps.',
      featured: false,
      exercises: [
        { slug: 'bench-press', sets: 4, reps: '8', restSeconds: 90, order: 1 },
        { slug: 'overhead-press', sets: 3, reps: '8', restSeconds: 60, order: 2 },
        { slug: 'incline-dumbbell-press', sets: 3, reps: '10', restSeconds: 60, order: 3 },
        { slug: 'lateral-raise', sets: 4, reps: '15', restSeconds: 45, order: 4 },
        { slug: 'tricep-pushdown', sets: 3, reps: '12', restSeconds: 45, order: 5 },
        { slug: 'overhead-tricep-extension', sets: 3, reps: '12', restSeconds: 45, order: 6 }
      ]
    },
    {
      name: 'Pull Day',
      slug: 'pull-day',
      category: 'Strength & Hypertrophy',
      difficulty: 'Intermediate',
      duration: 55,
      calories: 380,
      description: 'Focused pulls concentrating on the back, rear delts, and biceps.',
      featured: false,
      exercises: [
        { slug: 'pull-ups', sets: 4, reps: '8', restSeconds: 90, order: 1 },
        { slug: 'barbell-row', sets: 3, reps: '10', restSeconds: 60, order: 2 },
        { slug: 'lat-pulldown', sets: 3, reps: '12', restSeconds: 60, order: 3 },
        { slug: 'face-pulls', sets: 4, reps: '15', restSeconds: 45, order: 4 },
        { slug: 'bicep-curl', sets: 3, reps: '12', restSeconds: 45, order: 5 },
        { slug: 'hammer-curl', sets: 3, reps: '12', restSeconds: 45, order: 6 }
      ]
    },
    {
      name: 'HIIT Fat Burner',
      slug: 'hiit-fat-burner',
      category: 'Cardio & Conditioning',
      difficulty: 'Intermediate',
      duration: 30,
      calories: 350,
      description: 'Short, fast-paced bodyweight and conditioning splits designed to spike heart rate and torch body fat.',
      featured: false,
      exercises: [
        { slug: 'burpees', sets: 4, reps: '45s work', restSeconds: 15, order: 1 },
        { slug: 'kettlebell-swing', sets: 4, reps: '45s work', restSeconds: 15, order: 2 },
        { slug: 'planks', sets: 4, reps: '45s work', restSeconds: 15, order: 3 },
        { slug: 'burpees', sets: 4, reps: '30s work', restSeconds: 30, order: 4 }
      ]
    },
    {
      name: 'Core Crusher',
      slug: 'core-crusher',
      category: 'Core',
      difficulty: 'Beginner',
      duration: 20,
      calories: 150,
      description: 'A quick core program targeting the upper abs, lower abs, and obliques.',
      featured: false,
      exercises: [
        { slug: 'hanging-leg-raise', sets: 3, reps: '12', restSeconds: 45, order: 1 },
        { slug: 'cable-crunch', sets: 3, reps: '15', restSeconds: 45, order: 2 },
        { slug: 'planks', sets: 3, reps: '90s hold', restSeconds: 30, order: 3 }
      ]
    },
    {
      name: 'Cardio Endurance Booster',
      slug: 'cardio-endurance-booster',
      category: 'Cardio',
      difficulty: 'Beginner',
      duration: 40,
      calories: 320,
      description: 'Slow-pace cardiovascular workout aimed to build stamina and lung capacity.',
      featured: false,
      exercises: [
        { slug: 'kettlebell-swing', sets: 5, reps: '20', restSeconds: 60, order: 1 },
        { slug: 'burpees', sets: 5, reps: '12', restSeconds: 60, order: 2 },
        { slug: 'planks', sets: 3, reps: '60s hold', restSeconds: 30, order: 3 }
      ]
    }
  ];

  for (const wp of workoutPlansData) {
    const createdPlan = await prisma.workoutPlan.create({
      data: {
        name: wp.name,
        slug: wp.slug,
        category: wp.category,
        difficulty: wp.difficulty,
        duration: wp.duration,
        calories: wp.calories,
        description: wp.description,
        featured: wp.featured,
      }
    });

    for (const exMap of wp.exercises) {
      const exercise = createdExercises[exMap.slug];
      if (exercise) {
        await prisma.workoutExercise.create({
          data: {
            workoutPlanId: createdPlan.id,
            exerciseId: exercise.id,
            sets: exMap.sets,
            reps: exMap.reps,
            restSeconds: exMap.restSeconds,
            order: exMap.order,
          }
        });
      }
    }
  }
  console.log(`Seeded ${workoutPlansData.length} Workout Plans and linked exercises.`);

  console.log('Seeding gym locations across India...');
  const locations = [
    { name: 'AB Fitness - Bandra West', city: 'Mumbai', state: 'Maharashtra', address: 'Linking Road, Opp KFC, Bandra West, Mumbai 400050', phone: '022-26458991', email: 'bandra@abfitness.com', lat: 19.0596, lng: 72.8295, rating: 4.8, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
    { name: 'AB Fitness - Andheri East', city: 'Mumbai', state: 'Maharashtra', address: 'JB Nagar, Near Metro Station, Andheri East, Mumbai 400059', phone: '022-28394451', email: 'andheri@abfitness.com', lat: 19.1155, lng: 72.8680, rating: 4.6, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800' },
    { name: 'AB Fitness - Connaught Place', city: 'Delhi', state: 'Delhi', address: 'Inner Circle, CP, New Delhi 110001', phone: '011-45678901', email: 'cp@abfitness.com', lat: 28.6304, lng: 77.2177, rating: 4.7, timings: '5:30 AM - 11:30 PM', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' },
    { name: 'AB Fitness - Saket', city: 'Delhi', state: 'Delhi', address: 'MGF Metropolitan Mall, Saket, New Delhi 110017', phone: '011-40912234', email: 'saket@abfitness.com', lat: 28.5286, lng: 77.2193, rating: 4.5, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800' },
    { name: 'AB Fitness - Indiranagar', city: 'Bengaluru', state: 'Karnataka', address: '100 Feet Road, Indiranagar, Bengaluru 560038', phone: '080-41223456', email: 'indiranagar@abfitness.com', lat: 12.9719, lng: 77.6412, rating: 4.9, timings: '5:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800' },
    { name: 'AB Fitness - HSR Layout', city: 'Bengaluru', state: 'Karnataka', address: '27th Main, Sector 1, HSR Layout, Bengaluru 560102', phone: '080-43229988', email: 'hsr@abfitness.com', lat: 12.9102, lng: 77.6450, rating: 4.7, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
    { name: 'AB Fitness - Koregaon Park', city: 'Pune', state: 'Maharashtra', address: 'Lane 5, Koregaon Park, Pune 411001', phone: '020-66014499', email: 'kp@abfitness.com', lat: 18.5362, lng: 73.8940, rating: 4.8, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800' },
    { name: 'AB Fitness - Kothrud', city: 'Pune', state: 'Maharashtra', address: 'Paud Road, Kothrud, Pune 411038', phone: '020-66014488', email: 'kothrud@abfitness.com', lat: 18.5074, lng: 73.8077, rating: 4.5, timings: '6:00 AM - 10:30 PM', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' },
    { name: 'AB Fitness - Jubilee Hills', city: 'Hyderabad', state: 'Telangana', address: 'Road No. 36, Jubilee Hills, Hyderabad 500033', phone: '040-44919191', email: 'jubilee@abfitness.com', lat: 17.4325, lng: 78.4071, rating: 4.9, timings: '5:00 AM - 11:30 PM', imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800' },
    { name: 'AB Fitness - Gachibowli', city: 'Hyderabad', state: 'Telangana', address: 'Telecom Nagar, Gachibowli, Hyderabad 500032', phone: '040-44919192', email: 'gachibowli@abfitness.com', lat: 17.4447, lng: 78.3484, rating: 4.6, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800' },
    { name: 'AB Fitness - Nungambakkam', city: 'Chennai', state: 'Tamil Nadu', address: 'Khader Nawaz Khan Road, Nungambakkam, Chennai 600006', phone: '044-28271122', email: 'chennai.nb@abfitness.com', lat: 13.0607, lng: 80.2510, rating: 4.7, timings: '5:30 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
    { name: 'AB Fitness - Adyar', city: 'Chennai', state: 'Tamil Nadu', address: 'Gandhi Nagar, Adyar, Chennai 600020', phone: '044-28271133', email: 'adyar@abfitness.com', lat: 13.0063, lng: 80.2574, rating: 4.5, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800' },
    { name: 'AB Fitness - CG Road', city: 'Ahmedabad', state: 'Gujarat', address: 'Samartheswar Temple Road, CG Road, Ahmedabad 380009', phone: '079-26441122', email: 'cgroad@abfitness.com', lat: 23.0258, lng: 72.5623, rating: 4.6, timings: '6:00 AM - 10:30 PM', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' },
    { name: 'AB Fitness - Salt Lake', city: 'Kolkata', state: 'West Bengal', address: 'Sector V, Salt Lake, Kolkata 700091', phone: '033-23579911', email: 'saltlake@abfitness.com', lat: 22.5726, lng: 88.4347, rating: 4.7, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800' },
    { name: 'AB Fitness - Ballygunge', city: 'Kolkata', state: 'West Bengal', address: 'Ballygunge Circular Road, Kolkata 700019', phone: '033-23579922', email: 'ballygunge@abfitness.com', lat: 22.5312, lng: 88.3619, rating: 4.8, timings: '5:30 AM - 10:30 PM', imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800' },
    { name: 'AB Fitness - DLF Phase 3', city: 'Gurugram', state: 'Haryana', address: 'Cyber City, Sector 24, Gurugram 122002', phone: '0124-4091919', email: 'cybercity@abfitness.com', lat: 28.4901, lng: 77.0890, rating: 4.8, timings: '5:30 AM - 11:30 PM', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
    { name: 'AB Fitness - Sector 62', city: 'Noida', state: 'Uttar Pradesh', address: 'Towers Area, Sector 62, Noida 201301', phone: '0120-4221199', email: 'noida@abfitness.com', lat: 28.6273, lng: 77.3725, rating: 4.5, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800' },
    { name: 'AB Fitness - Sector 17', city: 'Chandigarh', state: 'Punjab', address: 'Sector 17 Market, Chandigarh 160017', phone: '0172-4668811', email: 'chandigarh@abfitness.com', lat: 30.7415, lng: 76.7821, rating: 4.8, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' },
    { name: 'AB Fitness - Malviya Nagar', city: 'Jaipur', state: 'Rajasthan', address: 'Calgiri Marg, Malviya Nagar, Jaipur 302017', phone: '0141-2729911', email: 'jaipur@abfitness.com', lat: 26.8530, lng: 75.8256, rating: 4.6, timings: '6:00 AM - 10:30 PM', imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800' },
    { name: 'AB Fitness - Hazratganj', city: 'Lucknow', state: 'Uttar Pradesh', address: 'Shahnajaf Road, Hazratganj, Lucknow 226001', phone: '0522-2621122', email: 'lucknow@abfitness.com', lat: 26.8496, lng: 80.9459, rating: 4.6, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800' },
    { name: 'AB Fitness - Panaji', city: 'Goa', state: 'Goa', address: 'MG Road, Panaji, Goa 403001', phone: '0832-2423344', email: 'goa@abfitness.com', lat: 15.4909, lng: 73.8278, rating: 4.7, timings: '6:00 AM - 10:00 PM', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
    { name: 'AB Fitness - Vijay Nagar', city: 'Indore', state: 'Madhya Pradesh', address: 'C21 Mall, Vijay Nagar, Indore 452010', phone: '0731-4223399', email: 'indore@abfitness.com', lat: 22.7533, lng: 75.8937, rating: 4.7, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800' },
    { name: 'AB Fitness - Frazer Road', city: 'Patna', state: 'Bihar', address: 'Maurya Lok Complex, Frazer Road, Patna 800001', phone: '0612-2201122', email: 'patna@abfitness.com', lat: 25.6111, lng: 85.1376, rating: 4.4, timings: '6:00 AM - 10:00 PM', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' },
    { name: 'AB Fitness - MP Nagar', city: 'Bhopal', state: 'Madhya Pradesh', address: 'Zone-I, Maharana Pratap Nagar, Bhopal 462011', phone: '0755-4221188', email: 'bhopal@abfitness.com', lat: 23.2324, lng: 77.4312, rating: 4.5, timings: '6:00 AM - 10:30 PM', imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800' },
    { name: 'AB Fitness - Saheed Nagar', city: 'Bhubaneswar', state: 'Odisha', address: 'Janpath, Saheed Nagar, Bhubaneswar 751007', phone: '0674-2541122', email: 'bhubaneswar@abfitness.com', lat: 20.2892, lng: 85.8433, rating: 4.6, timings: '6:00 AM - 10:30 PM', imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800' },
    { name: 'AB Fitness - RS Puram', city: 'Coimbatore', state: 'Tamil Nadu', address: 'DB Road, RS Puram, Coimbatore 641002', phone: '0422-2545566', email: 'coimbatore@abfitness.com', lat: 11.0115, lng: 76.9501, rating: 4.7, timings: '6:00 AM - 11:00 PM', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' }
  ];

  const amenitiesList = [
    ['WiFi', 'Cardio Zone', 'CrossFit', 'Cafe', 'Locker Room'],
    ['WiFi', 'Cardio Zone', 'Locker Room', 'Steam Bath'],
    ['WiFi', 'Cardio Zone', 'CrossFit', 'Personal Training', 'Juice Bar'],
    ['WiFi', 'Cardio Zone', 'Locker Room', 'Parking'],
    ['WiFi', 'Cardio Zone', 'CrossFit', 'Cafe', 'Steam Bath', 'Shower']
  ];

  let locationCount = 0;
  for (const loc of locations) {
    const amenities = amenitiesList[locationCount % amenitiesList.length];
    await prisma.gymLocation.create({
      data: {
        name: loc.name,
        city: loc.city,
        state: loc.state,
        address: loc.address,
        phone: loc.phone,
        email: loc.email,
        lat: loc.lat,
        lng: loc.lng,
        timings: loc.timings,
        rating: loc.rating,
        imageUrl: loc.imageUrl,
        amenities: JSON.stringify(amenities),
        active: true
      }
    });
    locationCount++;
  }
  console.log(`Seeded ${locationCount} gym locations.`);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
