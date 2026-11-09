






const DBKEY='bioenergetic_profile_v1';
const slots=['Waking','Pre-meal','Post-meal','Bedtime'];
const slotMeta=[{icon:'☀',sub:'Before getting up',tone:'dawn'},{icon:'◉',sub:'Before first meal',tone:'day'},{icon:'◒',sub:'45–60 min after meal',tone:'after'},{icon:'☾',sub:'Before sleep',tone:'night'}];
const modules=[
{title:'01 · Personal profile & health history',desc:'Context for interpreting measurements.',items:[
['age','Age (years)','number','20'],['sex','Sex assigned at birth','select',['Male','Female','Intersex','Prefer not to say']],['height','Height','text','e.g. 175 cm'],['current_weight','Current weight (kg)','number',''],['weight_history','Weight over the last 1–2 years','select',['Stable','Gradually increasing','Gradually decreasing','Fluctuates substantially','Not sure']],['health_conditions','Diagnosed health conditions','textarea','List diagnoses, or write none'],['family_history','Relevant family medical history','textarea','Thyroid, diabetes, cardiovascular, autoimmune, reproductive, other'],['medications','Prescription / OTC medications','textarea','Name, dose, frequency, duration'],['recent_illness','Recent infection, fever or illness in the last month?','select',['No','Yes','Not sure']],['smoking','Nicotine / tobacco use','select',['Never','Former','Occasional','Daily']],['alcohol','Alcohol use','select',['Never','Less than weekly','1–3 days/week','4+ days/week']],['baseline_goal','Main priority over the next 3 months','textarea','What would meaningful improvement look like?']]},
{title:'02 · Anthropometry & body composition',desc:'Track body size and change over time.',items:[
['waist','Waist circumference (cm)','number',''],['hip','Hip circumference (cm)','number',''],['bodyfat','Estimated body-fat percentage','number','Optional; include method in notes'],['weight_goal','Desired weight or body-composition direction','select',['Gain weight / muscle','Lose fat while preserving muscle','Recomposition','Maintain','Unsure']],['weight_appetite','Typical appetite','select',['Very low','Low','Moderate','High','Very high']],['weight_change','Unintentional weight change recently?','select',['No','Lost weight','Gained weight','Unsure']],['body_image','How confident are you in your body-composition estimate?','select',['Not confident','Somewhat','Reasonably','Very confident']]]},
{title:'03 · Thermoregulation & metabolism',desc:'Temperature, pulse, cold/heat tolerance and daily energy.',items:[
['morning_temp','Typical waking temperature (°F)','number','Measured value; note method'],['morning_pulse','Typical waking resting pulse (BPM)','number','Measured value, after waking'],['temp_method','Temperature measurement site','select',['Oral','Axillary','Ear','Forehead','Other / varies']],['cold_hands','Cold hands or feet','select',['Never','Rarely','Sometimes','Often','Almost always']],['cold_body','Feeling unusually cold compared with others','select',['Never','Rarely','Sometimes','Often','Almost always']],['heat_tolerance','Tolerance of warm environments','select',['Poor','Below average','Average','Good','Very good']],['sweating','Sweating pattern','select',['Very little','Typical','Heavy','Night sweats','Variable']],['energy_morning','Energy during first 2 hours after waking','select',['Very low','Low','Moderate','High','Very high']],['energy_day','Energy through the day','select',['Consistently low','Afternoon crash','Evening improvement','Stable','Highly variable']],['fatigue','Fatigue despite adequate sleep','select',['Never','Rarely','Sometimes','Often','Daily']],['exercise_tolerance','Exercise tolerance','select',['Poor','Below average','Average','Good','Excellent']],['recovery','Recovery after ordinary activity','select',['Slow','Somewhat slow','Typical','Fast','Unsure']],['sweat_sleep','Do you wake sweaty or overheated?','select',['Never','Rarely','Sometimes','Often']],['temperature_variation','Have you noticed a consistent daily temperature pattern?','select',['Yes, clear pattern','Some pattern','No clear pattern','I have not tracked it']],['metabolic_notes','Other temperature, pulse or energy observations','textarea','Describe patterns and when they occur']]},
{title:'04 · Post-meal response & digestion',desc:'Meal-related symptoms and timing.',items:[
['postmeal_energy','Energy 30–90 minutes after meals','select',['Usually improves','No consistent change','Usually worsens','Varies by meal']],['postmeal_temp','Have you measured temperature before and after meals?','select',['Yes, regularly','Occasionally','No']],['postmeal_pulse','Have you measured pulse before and after meals?','select',['Yes, regularly','Occasionally','No']],['satiety','How long does a typical meal keep you satisfied?','select',['Less than 1 hour','1–2 hours','2–4 hours','More than 4 hours','Variable']],['bloating','Bloating','select',['Never','Rarely','Sometimes','Often','Daily']],['reflux','Heartburn / reflux','select',['Never','Rarely','Sometimes','Often','Daily']],['nausea','Nausea','select',['Never','Rarely','Sometimes','Often']],['stool_frequency','Bowel movement frequency','select',['Less than 3/week','About once daily','2–3/day','More than 3/day','Highly variable']],['stool_consistency','Typical stool consistency (Bristol scale if known)','select',['Hard / lumpy (1–2)','Formed (3–4)','Loose (5–6)','Watery (7)','Variable / unsure']],['constipation','Straining or incomplete evacuation','select',['Never','Rarely','Sometimes','Often','Most bowel movements']],['abdominal_pain','Abdominal pain','select',['Never','Rarely','Sometimes','Often']],['food_reaction','Foods that reliably trigger symptoms','textarea','Food, amount, symptoms, time to onset'],['digestion_notes','Other digestive observations','textarea','']]},
{title:'05 · Sexual & reproductive health',desc:'Optional. Responses are private to this local browser profile.',items:[
['libido','How would you describe your libido over the last 3 months?','select',['Very low','Low','Moderate','High','Very high','Variable','Prefer not to answer']],['libido_change','Change in libido compared with your usual baseline','select',['Decreased','Unchanged','Increased','Fluctuates','Prefer not to answer']],['morning_erections','Frequency of morning erections','select',['Never','Less than weekly','A few times weekly','Most days','Daily','Prefer not to answer']],['erection_quality','Ability to achieve an erection when desired','select',['Consistently difficult','Often difficult','Sometimes difficult','Usually easy','Consistently easy','Not applicable / prefer not to answer']],['erection_maintenance','Ability to maintain an erection','select',['Consistently difficult','Often difficult','Sometimes difficult','Usually easy','Consistently easy','Not applicable / prefer not to answer']],['erection_context','Are erection difficulties situational or consistent?','select',['Situational','Consistent','Both','No difficulty','Prefer not to answer']],['ejaculation','Any concerns about ejaculation?','select',['No','Premature ejaculation','Delayed ejaculation','Difficulty ejaculating','Painful ejaculation','Other / prefer not to answer']],['sexual_satisfaction','Overall sexual satisfaction','select',['Very dissatisfied','Dissatisfied','Neutral','Satisfied','Very satisfied','Prefer not to answer']],['sexual_function_change','Recent change in sexual function','select',['No change','Improved','Worsened','Variable','Prefer not to answer']],['genital_pain','Genital, testicular or pelvic pain','select',['No','Occasional','Persistent','Prefer not to answer']],['urinary','Urinary symptoms (weak stream, urgency, pain, frequency)','select',['None','Mild','Moderate','Severe','Prefer not to answer']],['reproductive','Fertility or reproductive-health concerns','textarea','Optional'],['sexual_stress','Does stress, anxiety or relationship context affect sexual function?','select',['Not noticeably','A little','Moderately','A lot','Unsure','Prefer not to answer']],['sexual_notes','Anything else relevant to sexual health?','textarea','Optional; skip if uncomfortable']]},
{title:'06 · Circadian rhythm & sleep',desc:'Sleep timing, light exposure and regularity.',items:[
['bedtime','Usual bedtime','time',''],['waketime','Usual wake time','time',''],['sleep_duration','Average sleep duration (hours)','number',''],['sleep_latency','Time to fall asleep','select',['Under 15 min','15–30 min','30–60 min','Over 60 min']],['sleep_quality','Overall sleep quality','select',['Very poor','Poor','Fair','Good','Very good']],['night_awakenings','Typical awakenings per night','select',['None','1','2','3 or more','Variable']],['early_waking','Wake earlier than intended and cannot return to sleep?','select',['Never','Rarely','Sometimes','Often']],['daylight','Outdoor daylight within 1 hour of waking','select',['Almost never','1–2 days/week','3–5 days/week','6–7 days/week']],['evening_light','Bright screens / lighting in final hour before bed','select',['Almost none','A little','Moderate','A lot']],['caffeine_time','Latest usual caffeine time','select',['No caffeine','Before 10 AM','10 AM–12 PM','12–3 PM','After 3 PM']],['sleepiness','Daytime sleepiness','select',['Never','Rarely','Sometimes','Often','Daily']],['snoring','Loud snoring or witnessed breathing pauses?','select',['No','Snoring only','Breathing pauses reported','Unsure']],['chronotype','Natural preference','select',['Strong morning type','Somewhat morning','Neither','Somewhat evening','Strong evening']],['sleep_notes','Other sleep observations','textarea','']]},
{title:'07 · Cognition & mental performance',desc:'Subjective function, mood and mental stamina.',items:[
['focus','Ability to sustain focus','select',['Very poor','Poor','Average','Good','Excellent']],['memory','Short-term memory','select',['Very poor','Poor','Average','Good','Excellent']],['brainfog','Brain fog / mental sluggishness','select',['Never','Rarely','Sometimes','Often','Daily']],['motivation','Motivation and initiative','select',['Very low','Low','Moderate','High','Very high']],['mood','Typical mood','select',['Very low','Low','Neutral','Good','Very good']],['irritability','Irritability','select',['Never','Rarely','Sometimes','Often','Daily']],['anxiety','Anxiety or persistent worry','select',['None','Mild','Moderate','High','Severe','Prefer not to answer']],['mental_fatigue','Mental fatigue after concentrated work','select',['Very quickly','Within an hour','After several hours','Rarely']],['cognitive_change','Recent change in cognitive function','select',['Worsened','Unchanged','Improved','Variable']],['cognitive_notes','Examples of cognitive strengths or difficulties','textarea','']]},
{title:'08 · Muscle mass & physical performance',desc:'Training, strength, recovery and progression.',items:[
['training_type','Current resistance training','select',['None','Bodyweight','Weights','Machines','Mixed']],['training_frequency','Resistance-training days per week','number',''],['training_duration','Typical session duration (minutes)','number',''],['training_experience','Training experience','select',['Beginner','Under 1 year','1–3 years','3–5 years','Over 5 years']],['strength_trend','Strength over the last 3 months','select',['Decreasing','Unchanged','Increasing slowly','Increasing steadily','Not tracked']],['progressive_overload','Do you track sets, reps and loads?','select',['Never','Sometimes','Usually','Every session']],['soreness','Typical post-training soreness','select',['Minimal','Mild','Moderate','Severe / prolonged']],['recovery_days','Time needed to recover from hard sessions','select',['Under 24 hours','24–48 hours','48–72 hours','Over 72 hours','Variable']],['injuries','Current or recurring injuries','textarea',''],['steps','Average daily steps','number',''],['cardio','Cardiovascular activity per week','text','Type, sessions and duration'],['muscle_goal','Primary muscular goal','select',['Gain overall muscle','Improve strength','Improve power / athleticism','Recomposition','Maintain']],['performance_tests','Current strength benchmarks','textarea','Exercise, load, reps, date; optional'],['training_notes','Other training observations','textarea','']]},
{title:'09 · Nutrition & food intake',desc:'Expanded quantitative and qualitative dietary assessment.',items:[
['eating_pattern','Typical eating pattern','select',['1 meal/day','2 meals/day','3 meals/day','3 meals + snacks','Frequent small meals','Variable']],['calorie_estimate','Estimated daily energy intake (kcal)','number','Leave blank if unknown'],['food_log','Can you provide a representative 3-day food record?','textarea','List foods, quantities, drinks, cooking fats and approximate times for 3 typical days.'],['meal_times','Usual meal times','textarea','Breakfast, lunch, dinner, snacks'],['milk_ml','Milk / dairy milk (mL per day)','number','Include type and fat percentage in notes'],['dairy_other','Other dairy intake','textarea','Curd, yogurt, paneer, cheese, cream; quantities'],['eggs_day','Eggs per day (average)','number',''],['fruit_day','Fruit servings per day','number','Specify fruits and quantities in notes'],['juice_day','Fruit juice / sweet drinks per day','text','Type and approximate mL'],['starch_day','Main starches and approximate daily quantities','textarea','Rice, potatoes, wheat, oats, etc.; cooked or dry weights'],['sugar_day','Added sugar / honey / sucrose per day (g)','number','Estimate if possible'],['protein_g','Estimated protein per day (g)','number',''],['protein_sources','Main protein sources and quantities','textarea','Dairy, eggs, meat, fish, legumes, gelatin, etc.'],['protein_distribution','How is protein distributed across meals?','select',['Mostly one meal','Two meals','Across 3 meals','Across 4+ feedings','Unsure']],['meat_frequency','Meat / poultry frequency','select',['Never','Less than weekly','1–3 times/week','4–6 times/week','Daily']],['fish_frequency','Fish / seafood frequency','select',['Never','Less than weekly','1–3 times/week','4+ times/week']],['liver_frequency','Liver / organ meat frequency','select',['Never','Less than monthly','1–3 times/month','Weekly','More than weekly']],['gelatin','Gelatin / collagen intake','text','Grams per day or week; source'],['fat_sources','Main cooking fats and spreads','textarea','Butter, ghee, coconut oil, olive oil, seed oils, etc.'],['fat_estimate','Estimated total fat intake (g/day)','number','Optional'],['carb_estimate','Estimated carbohydrate intake (g/day)','number','Optional'],['fiber_estimate','Estimated fiber intake (g/day)','number','Optional'],['seed_oils','Frequency of foods cooked in industrial seed oils','select',['Rarely / never','1–2 times/week','3–5 times/week','Most days','Unsure']],['vegetables','Vegetable intake','textarea','Types and approximate daily quantities'],['legumes','Legumes / beans / lentils intake','text','Frequency and quantity'],['nuts_seeds','Nuts and seeds intake','textarea','Types and approximate quantities'],['salt','Salt added to food','select',['Very little','Moderate','Generous','Highly variable','Not sure']],['water','Approximate fluids per day (L)','number','Include water and other drinks'],['caffeine','Caffeine intake','textarea','Coffee, tea, energy drinks; quantity and timing'],['alcohol_nutrition','Alcohol intake','text','Type, quantity and frequency'],['supp_food','Food restrictions or exclusions','textarea','Allergies, intolerances, ethical or personal restrictions'],['hunger','Hunger between meals','select',['Rarely hungry','Mild hunger','Often hungry','Very hungry / difficult to satisfy','Variable']],['cravings','Common cravings','textarea','Sweet, salty, fatty, starch, other; timing'],['food_tolerance','Foods that improve or worsen how you feel','textarea','Include portion size and symptoms'],['meal_response','Typical response after a high-carbohydrate meal','select',['More energetic / comfortable','Sleepy / sluggish','Hungry again quickly','No clear change','Depends on meal']],['meal_composition','Meal composition most associated with good satiety','textarea','Describe foods and approximate portions'],['diet_change','Major dietary changes in the last 3 months','textarea','What changed and what happened afterward'],['nutrition_confidence','How confident are your intake estimates?','select',['Low; mostly guesses','Moderate','High; weighed / tracked foods']],['nutrition_notes','Other nutrition details','textarea','Include cooking methods, food access, budget constraints or anything missed.']]},
{title:'10 · Stress, environment & lifestyle',desc:'Contextual factors that influence recovery and measurements.',items:[
['stress_level','Average perceived stress','select',['Very low','Low','Moderate','High','Very high']],['stress_sources','Main sources of stress','textarea',''],['sunlight','Typical outdoor daylight exposure per day (minutes)','number',''],['temperature_env','Typical sleeping-room temperature','text','If known, °C or °F'],['work_schedule','Work / study schedule','select',['Regular daytime','Early shift','Evening shift','Night shift','Irregular']],['sedentary','Approximate sitting time per day (hours)','number',''],['outdoors','Time spent outdoors','select',['Almost none','Under 30 min','30–60 min','1–2 hours','Over 2 hours']],['social','Social connection / support','select',['Very limited','Limited','Adequate','Strong']],['relaxation','Regular relaxation or recovery practices','textarea','Walking, breathing, hobbies, etc.'],['lifestyle_notes','Other lifestyle factors','textarea','']]},
{title:'11 · Goals, agency & life direction',desc:'Map goals across health and everyday life. These questions explore perceived control, expectations and responses to setbacks; they do not diagnose learned helplessness or any mental-health condition.',items:[
['priority_goal','Top three health priorities','textarea','Rank them and explain why they matter.'],
['life_priorities','What are your three most important non-health goals?','textarea','Examples: education, work, money, relationships, creativity, independence, contribution or living conditions. Be specific.'],
['life_domains','Which areas of life currently feel most stuck or neglected?','textarea','Describe what is happening, not just a label.'],
['success_definition','What measurable progress would count as success in the next 12 weeks?','textarea','Include health and non-health outcomes. Separate what you control from what depends on others or circumstances.'],
['long_term_direction','Where would you like your life to be in 1 year and 5 years?','textarea','What would an ordinary week look like if things were moving in the right direction?'],
['goal_action','What concrete action have you taken toward an important personal goal in the last 30 days?','textarea','Include small actions. If none, explain what got in the way without judging yourself.'],
['goal_followthrough','When you set a goal, how often do you follow through on the next planned step?','select',['Almost never','Rarely','About half the time','Usually','Almost always','I rarely set specific goals']],
['perceived_control','How much influence do you feel you have over improving your current circumstances?','select',['Almost none','A little','Some','A lot','A great deal','Unsure']],
['effort_belief','When you make a sustained effort, how often do you expect it to change the outcome?','select',['Almost never','Rarely','Sometimes','Usually','Almost always','Depends strongly on the situation']],
['setback_response','When an attempt fails, what is your usual response?','select',['I stop trying for a long time','I assume further effort will not matter','I feel discouraged but try a different approach','I review what failed and adjust','I seek help or change the conditions','It varies']],
['failure_attribution','When something does not work out, what explanation comes to mind first?','select',['It is entirely outside my control','I lack the ability to change it','I did not have the right strategy or information','I did not persist or follow through','Several factors, including external constraints','I am not sure']],
['barriers','What most often prevents you from acting on your goals?','textarea','Consider money, time, health, skills, fear, low confidence, unclear next steps, family demands, environment or repeated setbacks.'],
['available_support','What resources or support could realistically help you make progress?','textarea','People, money, training, tools, information, access or changes to your environment.'],
['small_next_step','What is one small action you are willing and able to take in the next 7 days?','textarea','Make it observable and within your control.'],
['tracking_capacity','How often can you realistically log health measurements?','select',['Once daily','Morning and selected meal readings','Several times daily','A few days per week','Only when symptoms change']],
['barriers_tracking','What could interfere with consistent health tracking?','textarea',''],
['future_expectation','How do you generally view your ability to build a better future?','select',['I do not expect things to improve','I am mostly pessimistic','Mixed / uncertain',' cautiously optimistic','Strongly optimistic']],
['other_context','Anything else about your circumstances, goals or sense of control that matters?','textarea','']]} 
];

// Expanded field-performance tests.
modules[7].items.push(
['pushups_max','Maximum strict-form push-ups in one set','number','Chest reaches consistent depth; stop when form breaks.'],
['pullups_max','Maximum strict pull-ups in one set','number','Specify grip and range of motion in notes.'],
['plank_time','Front plank hold (seconds)','number','Stop when position fails.'],
['balance_left','Single-leg balance, left (seconds)','number','Eyes open, safe flat surface; stop at loss of balance.'],
['balance_right','Single-leg balance, right (seconds)','number','Eyes open, safe flat surface; stop at loss of balance.'],
['grip_left','Grip strength, left hand (kg)','number','Only if using a calibrated dynamometer.'],
['grip_right','Grip strength, right hand (kg)','number','Only if using a calibrated dynamometer.'],
['sprint_test','Sprint test result','textarea','Distance, time, surface, footwear, timing method and date. Do not sprint maximally without suitable preparation.'],
['hiit_frequency','HIIT sessions per week','number','Include intervals and recovery periods in notes.'],
['hiit_details','HIIT format and total weekly volume','textarea','Exercise, work interval, recovery, rounds, intensity and how you judge intensity.'],
['jump_test','Jump / power test','textarea','Optional: standing broad jump or vertical jump; describe method and result.'],
['fitness_notes','Testing conditions and limitations','textarea','Recent training, injuries, fatigue, surface, equipment and test repeatability.']
);

const D4Questionnaire = D4QuestionnaireRegistry.build(modules);
const D4RegistryValidation = D4QuestionnaireRegistry.validateRegistry(D4Questionnaire);
if(!D4RegistryValidation.valid) console.error('D4 questionnaire registry validation failed',D4RegistryValidation.errors);

const supplementCatalog = [
['Thiamine (B1)','Vitamin'],['Riboflavin (B2)','Vitamin'],['Niacin / niacinamide (B3)','Vitamin'],['Pantothenic acid (B5)','Vitamin'],['Pyridoxine / P5P (B6)','Vitamin'],['Biotin (B7)','Vitamin'],['Folate (B9)','Vitamin'],['Cobalamin (B12)','Vitamin'],['Vitamin A / retinol','Vitamin'],['Vitamin C','Vitamin'],['Vitamin D','Vitamin'],['Vitamin E','Vitamin'],['Vitamin K / K2','Vitamin'],
['Magnesium','Mineral'],['Calcium','Mineral'],['Sodium chloride (salt)','Electrolyte'],['Potassium','Mineral'],['Zinc','Mineral'],['Copper','Mineral'],['Selenium','Mineral'],
['Sodium bicarbonate (baking soda)','Other'],['Glycine','Amino acid'],['Taurine','Amino acid'],['Creatine','Performance'],['Gelatin / collagen','Protein'],['Whole eggs','Food'],['Liver / organ meat','Food'],['Caffeine / coffee','Stimulant'],['Aspirin (acetylsalicylic acid)','Medicine'],['N-acetylcysteine (NAC)','Other'],['Pregnenolone','Hormone-related'],['Progesterone','Hormone'],['DHEA','Hormone'],['T3 (liothyronine)','Prescription thyroid hormone'],['T4 (levothyroxine)','Prescription thyroid hormone'],['Desiccated thyroid','Prescription thyroid medicine'],['Cyproheptadine','Prescription medicine'],['Other / custom','Other']
];

function loadDB(){try{return JSON.parse(localStorage.getItem(DBKEY))||{logs:{},assessment:{},supplements:{},customSupplements:[]}}catch(e){return{logs:{},assessment:{},supplements:{},customSupplements:[]}}}
const baseSupplementCount=supplementCatalog.length;
let db=loadDB(); db.supplements ||= {}; db.logs ||= {}; db.assessment ||= {}; db.customSupplements ||= []; db.supplementSchedules ||= {}; db.supplementAdherence ||= {}; db.healthData ||= {daily:{},labs:[]}; db.healthData.daily ||= {}; db.healthData.labs ||= [];
['supplements','supp_effects','supp_changes','med_changes','adverse','wearables','hrv','glucose_tracking','fasting','cold_exposure','heat_exposure','breathing_practice','light_tools','red_light','grounding','experiment_log','planned_experiment','biohack_notes'].forEach(k=>delete db.assessment[k]); db.customSupplements.forEach(n=>{if(!supplementCatalog.some(x=>x[0].toLowerCase()===n.toLowerCase()))supplementCatalog.push([n,'Custom'])});
// Migrate first-version 14-point logs into the simpler four-point format without discarding the original data.
Object.values(db.logs).forEach(l=>{if((l.measurements||[]).length>4){const old=l.measurements; l.measurements=[old[0],old[1],old[3],old[13]].map((m,i)=>({...m,label:slots[i]}));}});
function morning(log){
  const measurements=Array.isArray(log?.measurements)?log.measurements:[];
  // The first slot is the waking measurement in the current four-checkpoint layout.
  // Older records are handled by selecting a label that indicates waking/morning when available.
  const labelled=measurements.find(m=>/upon waking|waking|morning/i.test(String(m?.label||'')));
  const m=labelled||measurements[0]||{};
  return {temp:m.temp??null,pulse:m.pulse??null,time:m.time||'',label:m.label||'Upon waking'};
}
function latestLogs(){
  return Object.values(db.logs||{}).filter(l=>l&&typeof l==='object').sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));
}
function saveDB(){localStorage.setItem(DBKEY,JSON.stringify(db))}
function today(){let d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function showView(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===id));if(id==='dashboard')renderDashboard();if(id==='trends')renderTrends();if(id==='supplements'){renderSupplements();renderSupplementTracker();}if(id==='healthdata')renderHealthData();window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.getElementById('todayLabel').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'})+' · Your records are stored in this browser.';
function formatPickerTime(minutes){
 const h=Math.floor(minutes/60),m=minutes%60;
 return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
}
function displayPickerTime(value){
 if(!value)return '--:-- --';
 const [h,m]=value.split(':').map(Number),suffix=h>=12?'PM':'AM',hour=(h%12)||12;
 return String(hour).padStart(2,'0')+':'+String(m).padStart(2,'0')+' '+suffix;
}
function timePickerHTML(id,value=''){
 const initial=value||'';
 return `<div class="timepicker stepper-time-picker" data-timepicker="${id}">
 <input type="hidden" id="${id}" name="${id}" data-time-value value="${escapeHTML(initial)}">
 <div class="time-stepper">
  <button type="button" class="time-step-button" data-time-step="-1" aria-label="Decrease time by 15 minutes">−</button>
  <output class="time-step-display" data-time-display aria-live="polite">${displayPickerTime(initial)}</output>
  <button type="button" class="time-step-button" data-time-step="1" aria-label="Increase time by 15 minutes">+</button>
 </div>
 </div>`;
}
function getTimePicker(id){return document.querySelector(`[data-timepicker="${id}"] [data-time-value]`)?.value||''}
function setTimePicker(id,value){let host=document.getElementById(id+'Picker');if(host)host.innerHTML=timePickerHTML(id,value)}
function updateTimePicker(host,value){
 const hidden=host.querySelector('[data-time-value]'),display=host.querySelector('[data-time-display]');
 if(hidden){hidden.value=value;hidden.dispatchEvent(new Event('input',{bubbles:true}));hidden.dispatchEvent(new Event('change',{bubbles:true}))}
 if(display)display.textContent=displayPickerTime(value);
}
function stepTimePicker(button){
 const host=button.closest('[data-timepicker]'),hidden=host?.querySelector('[data-time-value]');
 if(!host||!hidden)return;
 const current=hidden.value||'07:00';
 const [hours,minutes]=current.split(':').map(Number);
 let total=((hours*60+minutes)+(Number(button.dataset.timeStep)*15))%(24*60);
 if(total<0)total+=24*60;
 updateTimePicker(host,formatPickerTime(total));
}
let timeStepHoldTimer=null,timeStepHoldDelay=null,activeTimeStepButton=null;
function stopTimeStepHold(){
 if(timeStepHoldDelay)clearTimeout(timeStepHoldDelay);
 if(timeStepHoldTimer)clearInterval(timeStepHoldTimer);
 timeStepHoldDelay=null;timeStepHoldTimer=null;
 if(activeTimeStepButton){try{activeTimeStepButton.releasePointerCapture?.(activeTimeStepButton._holdPointerId)}catch(e){}}
 activeTimeStepButton=null;
}
document.addEventListener('pointerdown',e=>{
 const button=e.target.closest('[data-time-step]');
 if(!button)return;
 e.preventDefault();
 stopTimeStepHold();
 activeTimeStepButton=button;
 button._holdPointerId=e.pointerId;
 try{button.setPointerCapture(e.pointerId)}catch(err){}
 stepTimePicker(button);
 timeStepHoldDelay=setTimeout(()=>{timeStepHoldTimer=setInterval(()=>{if(activeTimeStepButton===button)stepTimePicker(button)},125)},420);
});
['pointerup','pointercancel','blur'].forEach(eventName=>window.addEventListener(eventName,stopTimeStepHold));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTimeStepHold()});
document.addEventListener('keydown',e=>{
 const button=e.target.closest('[data-time-step]');
 if(button&&(e.key==='Enter'||e.key===' ')){e.preventDefault();stepTimePicker(button)}
});

function nativeTimeHTML(id,value=''){
 return `<input type="hidden" id="${id}" value="${escapeHTML(value||'')}"><button type="button" class="picker-trigger time-trigger" data-open-clock="${id}"><span>${value?formatClockLabel(value):'Select time'}</span><b>◷</b></button>`;
}
function dailyTime(id){return document.getElementById(id)?.value||''}

let pickerTarget=null,pickerMode='',calendarCursor=new Date(),clockStage='hour',clockHour=8,clockMinute=0,clockPeriod='AM',scheduleTimeIndex=null;
let selectedTrackerDate=today();
function formatClockLabel(value){if(!value)return 'Select time';let [h,m]=value.split(':').map(Number);return `${String((h%12)||12).padStart(2,'0')} : ${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`}
function dateLabel(value,opts={weekday:'short',year:'numeric',month:'short',day:'numeric'}){let d=new Date(value+'T12:00:00');return isNaN(d)?value:d.toLocaleDateString(undefined,opts)}
function openPicker(mode,target,value=''){
 pickerMode=mode;pickerTarget=target;
 const overlay=document.getElementById('pickerOverlay');
 overlay.classList.add('show');overlay.setAttribute('aria-hidden','false');
 document.getElementById('calendarPanel').hidden=mode!=='calendar';
 document.getElementById('clockPanel').hidden=mode!=='clock';
 document.getElementById('pickerTitle').textContent=mode==='calendar'?'Select date':'Select time';
 document.getElementById('pickerBack').style.visibility='hidden';
 if(mode==='calendar'){let d=value?new Date(value+'T12:00:00'):new Date();calendarCursor=new Date(d.getFullYear(),d.getMonth(),1);renderCalendar()}
 else{let [h,m]=(value||'08:00').split(':').map(Number);clockHour=(h%12)||12;clockMinute=m||0;clockPeriod=h>=12?'PM':'AM';clockStage='hour';renderClock()}
}
function closePicker(){const o=document.getElementById('pickerOverlay');o.classList.remove('show');o.setAttribute('aria-hidden','true');pickerTarget=null;pickerMode=''}
function renderCalendar(){
 const y=calendarCursor.getFullYear(),m=calendarCursor.getMonth(),first=new Date(y,m,1),start=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate();
 document.getElementById('calendarMonth').textContent=calendarCursor.toLocaleDateString(undefined,{month:'long',year:'numeric'});
 const names=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
 let out=names.map(n=>`<span class="calendar-weekday">${n}</span>`).join('');
 for(let i=0;i<start;i++)out+='<span class="calendar-blank"></span>';
 for(let d=1;d<=days;d++){let date=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,active=pickerTarget==='trackerDate'?selectedTrackerDate===date:document.getElementById(pickerTarget)?.value===date;out+=`<button type="button" class="calendar-day ${active?'selected':''} ${date===today()?'today':''}" data-calendar-date="${date}">${d}</button>`}
 document.getElementById('calendarGrid').innerHTML=out;
}
function renderClock(){
 const values=clockStage==='hour'?Array.from({length:12},(_,i)=>i+1):Array.from({length:12},(_,i)=>i*5);
 const selected=clockStage==='hour'?clockHour:clockMinute;
 const face=document.getElementById('clockNumbers');
 face.innerHTML=values.map((v,i)=>{let angle=(i*30-90)*Math.PI/180,r=clockStage==='hour'?42:42,x=50+Math.cos(angle)*r,y=50+Math.sin(angle)*r,txt=clockStage==='hour'?String(v):String(v).padStart(2,'0');return `<button type="button" class="clock-number ${v===selected?'selected':''}" style="left:${x}%;top:${y}%" data-clock-value="${v}">${txt}</button>`}).join('');
 document.getElementById('clockStepLabel').textContent='';
 document.getElementById('clockReadout').innerHTML=`${String(clockHour).padStart(2,'0')} : ${String(clockMinute).padStart(2,'0')} <small>${clockPeriod}</small>`;
 document.getElementById('clockAM').classList.toggle('selected',clockPeriod==='AM');document.getElementById('clockPM').classList.toggle('selected',clockPeriod==='PM');
}
function applyPicker(){
 if(pickerMode==='calendar'){
  const chosen=document.querySelector('[data-calendar-date].selected')?.dataset.calendarDate;
  if(!chosen){closePicker();return}
  if(pickerTarget==='trackerDate'){selectedTrackerDate=chosen;renderSupplementTracker()}
  else{document.getElementById(pickerTarget).value=chosen;const label=document.getElementById(pickerTarget+'Label');if(label)label.textContent=dateLabel(chosen); }
 }else if(pickerMode==='clock'){
  const value=`${String(clockPeriod==='PM'?(clockHour%12)+12:clockHour%12).padStart(2,'0')}:${String(clockMinute).padStart(2,'0')}`;
  if(pickerTarget?.type==='schedule'){
   const name=pickerTarget.name,cfg=db.supplementSchedules[name]||{frequency:'daily',times:'08:00',days:'Mon, Tue, Wed, Thu, Fri, Sat, Sun'};
   let times=String(cfg.times||'').split(',').map(x=>x.trim()).filter(Boolean);
   if(scheduleTimeIndex===null)times.push(value);else times[scheduleTimeIndex]=value;
   db.supplementSchedules[name]={...cfg,times:[...new Set(times)].sort().join(', ')};saveDB();renderSupplementTracker();
  }else{
   const input=document.getElementById(pickerTarget);if(input)input.value=value;
   const button=document.querySelector(`[data-open-clock="${pickerTarget}"] span`);if(button)button.textContent=formatClockLabel(value);
  }
 }
 closePicker();
}
document.getElementById('pickerClose').addEventListener('click',closePicker);
document.getElementById('pickerCancel').addEventListener('click',closePicker);
document.getElementById('pickerApply').addEventListener('click',applyPicker);
document.getElementById('calendarPrev').addEventListener('click',()=>{calendarCursor.setMonth(calendarCursor.getMonth()-1);renderCalendar()});
document.getElementById('calendarNext').addEventListener('click',()=>{calendarCursor.setMonth(calendarCursor.getMonth()+1);renderCalendar()});
document.getElementById('calendarGrid').addEventListener('click',e=>{const b=e.target.closest('[data-calendar-date]');if(!b)return;document.querySelectorAll('[data-calendar-date]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')});
document.getElementById('clockNumbers').addEventListener('click',e=>{const b=e.target.closest('[data-clock-value]');if(!b)return;let v=Number(b.dataset.clockValue);if(clockStage==='hour'){clockHour=v;clockStage='minute'}else{clockMinute=v;clockStage='hour'}renderClock()});
document.getElementById('clockAM').addEventListener('click',()=>{clockPeriod='AM';renderClock()});
document.getElementById('clockPM').addEventListener('click',()=>{clockPeriod='PM';renderClock()});
document.addEventListener('click',e=>{
 const dateBtn=e.target.closest('[data-open-calendar]');if(dateBtn){let target=dateBtn.dataset.openCalendar;openPicker('calendar',target,target==='trackerDate'?selectedTrackerDate:document.getElementById(target).value);return}
 const timeBtn=e.target.closest('[data-open-clock]');if(timeBtn){openPicker('clock',timeBtn.dataset.openClock,document.getElementById(timeBtn.dataset.openClock)?.value||'08:00');return}
 const sched=e.target.closest('[data-schedule-time]');if(sched){scheduleTimeIndex=Number(sched.dataset.scheduleIndex);openPicker('clock',{type:'schedule',name:sched.dataset.scheduleName},sched.dataset.scheduleValue);return}
 const add=e.target.closest('[data-add-schedule-time]');if(add){scheduleTimeIndex=null;openPicker('clock',{type:'schedule',name:add.dataset.addScheduleTime},'08:00')}
});
function buildMeasurementRows(){
 document.getElementById('wakeTimePicker').innerHTML=nativeTimeHTML('wakeTime');
 document.getElementById('measurementRows').innerHTML=slots.map((label,i)=>`
 <details class="reading-card timeline-card checkpoint-card ${slotMeta[i].tone}" id="checkpoint${i}" ${i===3?'':'open'}>
  <summary class="checkpoint-summary">
   <span class="slot-heading"><span class="slot-icon" aria-hidden="true">${slotMeta[i].icon}</span><span class="checkpoint-title-wrap"><strong>${label}</strong><span class="slot-subtitle">${slotMeta[i].sub}</span></span></span>
   <span class="checkpoint-summary-right"><span class="checkpoint-state" id="checkpointState${i}">${i===3?'Optional':'Missing'}</span><span class="checkpoint-chevron">⌄</span></span>
  </summary>
  <div class="checkpoint-body">
   <div class="checkpoint-time"><label class="hint" for="tm${i}">Measurement time</label>${nativeTimeHTML('tm'+i)}</div>
   <div class="reading-fields">
    <div><label class="hint" for="tp${i}">Temperature <span class="temp-unit-label">°F</span></label><input aria-label="${label} temperature" type="number" inputmode="decimal" step=".1" min="85" max="110" placeholder="97.6" id="tp${i}"></div>
    <div><label class="hint" for="pu${i}">Pulse (BPM)</label><input aria-label="${label} pulse BPM" type="number" inputmode="numeric" step="1" min="25" max="240" placeholder="72" id="pu${i}"></div>
   </div>
  </div>
 </details>`).join('');
 document.querySelectorAll('#measurementRows input').forEach(el=>el.addEventListener('input',updateMeasurementQuality));
 document.querySelectorAll('#measurementRows details').forEach((d,i)=>d.addEventListener('toggle',()=>{if(d.open)updateMeasurementQuality()}));
 updateMeasurementQuality();
}
function currentTempUnit(){return document.getElementById('tempUnit')?.value||'F'}
function changeTempUnit(){
 const next=currentTempUnit(),previous=next==='F'?'C':'F';
 slots.forEach((_,i)=>{const el=document.getElementById('tp'+i);if(!el||el.value==='')return;const v=Number(el.value);el.value=(next==='C'?(v-32)*5/9:v*9/5+32).toFixed(1)});
 document.querySelectorAll('.temp-unit-label').forEach(el=>el.textContent='°'+next);
 document.querySelectorAll('#measurementRows input[id^="tp"]').forEach(el=>{el.min=next==='F'?'85':'29.4';el.max=next==='F'?'110':'43.3';el.placeholder=next==='F'?'97.6':'36.4'});
 updateMeasurementQuality();
}
function temperatureToF(value){return value===''?null:(currentTempUnit()==='C'?Number(value)*9/5+32:Number(value))}
function temperatureFromF(value){return value==null?'':(currentTempUnit()==='C'?(Number(value)-32)*5/9:Number(value)).toFixed(1)}
function checkpointCompleteness(i){
 const time=dailyTime('tm'+i),temp=document.getElementById('tp'+i)?.value??'',pulse=document.getElementById('pu'+i)?.value??'';
 return {time:!!time,temp:temp!=='',pulse:pulse!=='',complete:!!time&&temp!==''&&pulse!==''};
}
function updateMeasurementQuality(){
 if(!document.getElementById('measurementRows'))return;
 let core=0,complete=0,missing=[];
 slots.forEach((label,i)=>{
  const c=checkpointCompleteness(i),required=i!==3;
  if(required){core++;if(c.complete)complete++}
  const miss=[];if(!c.time)miss.push('time');if(!c.temp)miss.push('temperature');if(!c.pulse)miss.push('pulse');
  const state=document.getElementById('checkpointState'+i);
  if(state)state.textContent=c.complete?'Complete':(i===3&&!c.time&&!c.temp&&!c.pulse?'Optional':('Missing '+miss.join(', ')));
  if(required&&miss.length)missing.push(label+': '+miss.join(', '));
 });
 const quality=document.getElementById('measurementQuality');
 if(quality){
  const tags=[...document.querySelectorAll('[name="contextTag"]:checked')].map(x=>x.value);
  quality.innerHTML=`<div class="quality-top"><strong>Measurement quality</strong><span class="quality-score">${complete}/${core} core checkpoints complete</span></div><div class="quality-track"><span style="width:${Math.round(complete/core*100)}%"></span></div><div class="quality-detail">${missing.length?'Missing: '+missing.map(escapeHTML).join(' · '):'All core checkpoints have time, temperature and pulse.'}${tags.length?' · Context noted: '+tags.map(escapeHTML).join(', '):''}</div>`;
 }
}
function clearDailyForm(){
 document.querySelectorAll('#measurementRows input').forEach(x=>x.value='');
 ['wakeTime','dailyNotes','tm0','tm1','tm2','tm3'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';const b=document.querySelector(`[data-open-clock="${id}"] span`);if(b)b.textContent='Select time'});
 document.querySelectorAll('[name="contextTag"]').forEach(x=>x.checked=false);
 document.querySelectorAll('#measurementRows details').forEach((d,i)=>d.open=i!==3);
 document.getElementById('dailyStatus').textContent='Form cleared. Existing saved records were not changed.';
 updateMeasurementQuality();
}
function loadDaily(date){
 let l=db.logs[date];document.getElementById('logDate').value=date;document.getElementById('logDateLabel').textContent=dateLabel(date);
 document.getElementById('wakeTime').value=l?.wakeTime||'';document.querySelector('[data-open-clock="wakeTime"] span').textContent=formatClockLabel(l?.wakeTime||'');
 document.getElementById('dailyNotes').value=l?.notes||'';
 document.querySelector(`input[name="method"][value="${l?.method||'Oral'}"]`).checked=true;
 document.getElementById('tempUnit').value='F';
 slots.forEach((s,i)=>{
  let m=l?.measurements?.[i]||{};
  document.getElementById('tm'+i).value=m.time||'';document.querySelector(`[data-open-clock="tm${i}"] span`).textContent=formatClockLabel(m.time||'');
  document.getElementById('tp'+i).value=temperatureFromF(m.temp);
  document.getElementById('pu'+i).value=m.pulse??'';
  const c=checkpointCompleteness(i);document.getElementById('checkpoint'+i).open=!c.complete&&i!==3;
 });
 const tags=l?.contextTags||[];document.querySelectorAll('[name="contextTag"]').forEach(x=>x.checked=tags.includes(x.value));
 document.getElementById('dailyStatus').textContent=l?'Loaded '+date+' for editing.':'New log for '+date+'.';
 updateMeasurementQuality();showView('daily');
}
function saveDaily(){
 let date=document.getElementById('logDate').value;if(!date){alert('Choose a log date.');return}
 let measurements=slots.map((label,i)=>({label,time:dailyTime('tm'+i),temp:temperatureToF(document.getElementById('tp'+i).value),pulse:document.getElementById('pu'+i).value===''?null:Number(document.getElementById('pu'+i).value)}));
 for(let m of measurements){
  if(m.temp!==null&&(m.temp<85||m.temp>110)){alert('Check temperature entries. The converted value must be between 85°F and 110°F.');return}
  if(m.pulse!==null&&(m.pulse<25||m.pulse>240)){alert('Check pulse entries. Enter BPM values between 25 and 240.');return}
 }
 const contextTags=[...document.querySelectorAll('[name="contextTag"]:checked')].map(x=>x.value);
 db.logs[date]={date,wakeTime:dailyTime('wakeTime'),method:document.querySelector('input[name="method"]:checked').value,measurements,contextTags,notes:document.getElementById('dailyNotes').value};
 saveDB();document.getElementById('dailyStatus').textContent='Saved locally for '+date+'.';updateMeasurementQuality();renderDashboard();renderRecent();
}
function renderDashboard(){
 let logs=latestLogs(),last=logs[logs.length-1],m=morning(last);
 const hasTemp=m.temp!==null&&m.temp!==undefined&&m.temp!=='';
 const hasPulse=m.pulse!==null&&m.pulse!==undefined&&m.pulse!=='';
 document.getElementById('tempStat').classList.toggle('is-empty',!hasTemp);
 document.getElementById('pulseStat').classList.toggle('is-empty',!hasPulse);
 document.getElementById('tempEmpty').hidden=hasTemp;
 document.getElementById('pulseEmpty').hidden=hasPulse;
 document.getElementById('dashTemp').innerHTML=hasTemp?escapeHTML(m.temp)+' <span class="unit">°F</span>':'';
 document.getElementById('dashPulse').innerHTML=hasPulse?escapeHTML(m.pulse)+' <span class="unit">BPM</span>':'';
 document.getElementById('dashTempDate').textContent=hasTemp?(last?.date||''):'';
 document.getElementById('dashPulseDate').textContent=hasPulse?(last?.date||''):'';
 document.getElementById('dashDays').textContent=logs.length;
 let recent=logs.slice(-14);
 drawChart('dashTempChart',recent.map(x=>({x:x.date.slice(5),y:morning(x).temp})), '°F');
 drawChart('dashPulseChart',recent.map(x=>({x:x.date.slice(5),y:morning(x).pulse})),'BPM');
 let assessment=assessmentReadView(),total=modules.reduce((n,m)=>n+m.items.length,0),answered=Object.values(assessment).filter(v=>v!==''&&v!==null&&v!==undefined).length,p=Math.round(answered/total*100);
 document.getElementById('assessmentProgress').style.width=p+'%';
 document.getElementById('assessmentProgressText').textContent=`${p}% of profile fields completed (${answered}/${total})`;
 renderRecent();
}
function renderRecent(){
 let logs=latestLogs().slice(-10).reverse(),el=document.getElementById('recentLogs');
 if(!logs.length){el.className='empty-state-panel';el.innerHTML='<button type="button" class="empty-plus" onclick="showView(\'daily\')" aria-label="Create first daily log">+</button><div><strong>Your timeline starts here</strong><span>Save your first daily log to build a history you can compare.</span></div>';return}
 el.className='tablewrap';
 el.innerHTML='<table><thead><tr><th>Date</th><th>Morning temp</th><th>Morning pulse</th><th>Method</th><th></th></tr></thead><tbody>'+logs.map(l=>{
  const m=morning(l),temp=m.temp!==null&&m.temp!==undefined&&m.temp!==''?escapeHTML(m.temp)+' °F':'<span class="missing-metric">Not logged</span>',pulse=m.pulse!==null&&m.pulse!==undefined&&m.pulse!==''?escapeHTML(m.pulse)+' BPM':'<span class="missing-metric">Not logged</span>';
  return `<tr><td>${escapeHTML(l.date||'')}</td><td>${temp}</td><td>${pulse}</td><td>${escapeHTML(l.method||'')}</td><td><button class="btn secondary" onclick="loadDaily('${escapeHTML(l.date||'')}')">Edit</button></td></tr>`;
 }).join('')+'</tbody></table>';
}
function drawChart(id,points,unit){let c=document.getElementById(id);if(!c)return;let w=c.clientWidth||320,h=170,dpr=window.devicePixelRatio||1;c.width=w*dpr;c.height=h*dpr;let ctx=c.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);let vals=points.filter(p=>Number.isFinite(p.y));ctx.strokeStyle='#292e33';ctx.lineWidth=1;for(let i=1;i<4;i++){let y=i*h/4;ctx.beginPath();ctx.moveTo(28,y);ctx.lineTo(w-8,y);ctx.stroke()}if(vals.length<2){ctx.fillStyle='#71767b';ctx.font='12px system-ui';ctx.fillText(vals.length?'Add another reading to reveal a trend':'Log your first reading to activate this chart',34,h/2);return}let min=Math.min(...vals.map(p=>p.y)),max=Math.max(...vals.map(p=>p.y));if(min===max){min-=1;max+=1}let xstep=(w-45)/(points.length-1||1);ctx.strokeStyle='#dce6e9';ctx.lineWidth=2;ctx.beginPath();let started=false;points.forEach((p,i)=>{if(!Number.isFinite(p.y)){started=false;return}let x=30+i*xstep,y=h-20-(p.y-min)/(max-min)*(h-40);if(!started){ctx.moveTo(x,y);started=true}else ctx.lineTo(x,y)});ctx.stroke();points.forEach((p,i)=>{if(!Number.isFinite(p.y))return;let x=30+i*xstep,y=h-20-(p.y-min)/(max-min)*(h-40);ctx.fillStyle='#e7e9ea';ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill()});ctx.fillStyle='#71767b';ctx.font='10px system-ui';ctx.fillText(max.toFixed(1),2,13);ctx.fillText(min.toFixed(1),2,h-6);ctx.fillText(points[0]?.x||'',28,h-3);ctx.fillText(points[points.length-1]?.x||'',Math.max(28,w-42),h-3)}

function healthDayFormValue(id){return document.getElementById(id)?.value??''}
function clearHealthDayForm(){
 ['hdWeight','hdSleepHours','hdSleepQuality','hdBedtime','hdWake','hdSymptoms','hdFood','hdNotes'].forEach(id=>{const e=document.getElementById(id);if(e)e.value=''});
 const date=document.getElementById('hdDate');if(date)date.value=today();
 document.getElementById('hdStatus').textContent='Form cleared. Existing saved records were not changed.';
}
function loadHealthDay(date){
 const r=db.healthData.daily[date]||{};
 document.getElementById('hdDate').value=date;
 document.getElementById('hdWeight').value=r.weightKg??'';
 document.getElementById('hdSleepHours').value=r.sleepHours??'';
 document.getElementById('hdSleepQuality').value=r.sleepQuality??'';
 document.getElementById('hdBedtime').value=r.bedtime??'';
 document.getElementById('hdWake').value=r.wakeTime??'';
 document.getElementById('hdSymptoms').value=r.symptoms??'';
 document.getElementById('hdFood').value=r.food??'';
 document.getElementById('hdNotes').value=r.notes??'';
 document.getElementById('hdStatus').textContent='Loaded record for '+date+'. Save to update it.';
 window.scrollTo({top:0,behavior:'smooth'});
}
function saveHealthDay(){
 const date=healthDayFormValue('hdDate');if(!date){document.getElementById('hdStatus').textContent='Choose a record date.';return}
 const weight=healthDayFormValue('hdWeight'),sleep=healthDayFormValue('hdSleepHours');
 if((weight!==''&&(!Number.isFinite(Number(weight))||Number(weight)<=0||Number(weight)>500))||(sleep!==''&&(!Number.isFinite(Number(sleep))||Number(sleep)<0||Number(sleep)>24))){document.getElementById('hdStatus').textContent='Check the weight and sleep values.';return}
 const r={date,weightKg:weight===''?null:Number(weight),sleepHours:sleep===''?null:Number(sleep),sleepQuality:healthDayFormValue('hdSleepQuality'),bedtime:healthDayFormValue('hdBedtime'),wakeTime:healthDayFormValue('hdWake'),symptoms:healthDayFormValue('hdSymptoms').trim(),food:healthDayFormValue('hdFood').trim(),notes:healthDayFormValue('hdNotes').trim(),updatedAt:new Date().toISOString()};
 const hasData=Object.entries(r).some(([k,v])=>!['date','updatedAt'].includes(k)&&v!==null&&v!=='');
 if(!hasData){document.getElementById('hdStatus').textContent='Add at least one value before saving.';return}
 db.healthData.daily[date]=r;saveDB();document.getElementById('hdStatus').textContent='Saved locally for '+date+'.';renderHealthData(false);
}
function renderHealthData(loadToday=true){
 if(!db.healthData)db.healthData={daily:{},labs:[]};db.healthData.daily ||= {};db.healthData.labs ||= [];
 const dateEl=document.getElementById('hdDate');
 if(loadToday&&dateEl&&!dateEl.value){dateEl.value=today();loadHealthDay(dateEl.value)}
 const rows=Object.values(db.healthData.daily).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
 document.getElementById('hdDailyHistory').innerHTML=rows.length?'<table><thead><tr><th>Date</th><th>Weight</th><th>Sleep</th><th>Symptoms / food</th><th></th></tr></thead><tbody>'+rows.slice(0,60).map(r=>`<tr><td>${escapeHTML(r.date)}</td><td>${r.weightKg==null?'—':escapeHTML(r.weightKg)+' kg'}</td><td>${r.sleepHours==null?'—':escapeHTML(r.sleepHours)+' h'}</td><td>${escapeHTML([r.symptoms,r.food].filter(Boolean).join(' · ')||'—').slice(0,100)}</td><td><button class="btn secondary" onclick="loadHealthDay('${escapeHTML(r.date)}')">Edit</button></td></tr>`).join('')+'</tbody></table>':'<div class="empty">No daily health records yet.</div>';
 const trend=rows.slice(-30);
 drawChart('hdWeightChart',trend.map(r=>({x:r.date.slice(5),y:r.weightKg==null?null:Number(r.weightKg)})),'kg');
 drawChart('hdSleepChart',trend.map(r=>({x:r.date.slice(5),y:r.sleepHours==null?null:Number(r.sleepHours)})),'h');
}

function renderD4Longitudinal(){
 const host=document.getElementById('d4LongitudinalTable'),status=document.getElementById('d4LongitudinalStatus');
 if(!host||!status)return;
 try{
  const events=D4Longitudinal.collect(db);
  const metrics=['temperature','pulse','weight','sleep_duration','steps','water','protein','carbohydrate'];
  const rows=metrics.map(metric=>D4Longitudinal.summarize(events,metric)).filter(s=>s.count>0);
  status.textContent='Engine '+D4Longitudinal.VERSION+' · '+events.length+' normalized measurement events · '+(D4RegistryValidation.valid?D4Questionnaire.questionCount+' registry questions':'registry validation error');
  host.innerHTML=rows.length?'<table><thead><tr><th>Metric</th><th>Records</th><th>Latest</th><th>Mean</th><th>Median</th><th>Range</th><th>Latest date</th></tr></thead><tbody>'+rows.map(s=>{const f=v=>v==null?'—':(typeof v==='number'?v.toFixed(2):escapeHTML(v));return `<tr><td>${escapeHTML(s.metric.replace(/_/g,' '))} (${escapeHTML(s.unit||'—')})</td><td>${s.count}</td><td>${f(s.latest)}</td><td>${f(s.mean)}</td><td>${f(s.median)}</td><td>${f(s.minimum)}–${f(s.maximum)}</td><td>${escapeHTML(s.lastDate||'—')}</td></tr>`}).join('')+'</tbody></table>':'<div class="empty">No compatible longitudinal measurements yet. Add dated daily readings or health records to populate this overview.</div>';
 }catch(e){status.textContent='Longitudinal summary unavailable: '+(e.message||String(e));host.innerHTML='<div class="empty">The existing records were not changed.</div>';}
}

function renderTrends(){let logs=latestLogs(),range=document.getElementById('trendRange').value,metric=document.getElementById('trendMetric').value;if(range!=='all'){let cutoff=new Date();cutoff.setDate(cutoff.getDate()-Number(range)+1);let key=todayFrom(cutoff);logs=logs.filter(l=>l.date>=key)}let points=logs.map(l=>({x:l.date.slice(5),y:metric==='temp'?morning(l).temp:morning(l).pulse}));drawChart('trendChart',points,metric==='temp'?'°F':'BPM');let vals=points.filter(p=>Number.isFinite(p.y)).map(p=>p.y),avg=vals.length?(vals.reduce((a,b)=>a+b,0)/vals.length):null;document.getElementById('trendSummary').textContent=vals.length?`${vals.length} morning readings · Average ${avg.toFixed(1)} ${metric==='temp'?'°F':'BPM'} · Range ${Math.min(...vals).toFixed(1)}–${Math.max(...vals).toFixed(1)}`:'No morning readings in this period.';renderMealTable();renderDomainScores();renderD4Longitudinal()}
function todayFrom(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function renderMealTable(){let rows=[];latestLogs().forEach(l=>{let ms=l.measurements||[],before=ms[1],after=ms[2];if((before?.temp!=null||before?.pulse!=null)&&(after?.temp!=null||after?.pulse!=null))rows.push({date:l.date,dt:before.temp!=null&&after.temp!=null?(after.temp-before.temp).toFixed(1):'—',dp:before.pulse!=null&&after.pulse!=null?(after.pulse-before.pulse):'—'})});document.getElementById('mealTable').innerHTML=rows.length?'<table><thead><tr><th>Date</th><th>Temperature change °F</th><th>Pulse change BPM</th></tr></thead><tbody>'+rows.slice(-30).reverse().map(r=>`<tr><td>${r.date}</td><td>${r.dt}</td><td>${r.dp}</td></tr>`).join('')+'</tbody></table>':'<div class="empty">Log both pre-meal and 45–60 minute post-meal readings to compare them.</div>'}
function renderDomainScores(){let assessment=assessmentReadView(),groups=[['Metabolic',['morning_temp','morning_pulse','cold_hands','energy_morning','fatigue']],['Nutrition',['food_log','protein_g','carb_estimate','milk_ml','water','meal_times','food_tolerance']],['Sexual',['libido','morning_erections','erection_quality','sexual_satisfaction']],['Circadian',['bedtime','waketime','sleep_duration','daylight','sleep_quality']],['Cognitive',['focus','memory','brainfog','mental_fatigue']],['Muscular',['training_type','training_frequency','strength_trend','muscle_goal']],['Agency & goals',['life_priorities','perceived_control','effort_belief','goal_followthrough','small_next_step']]];document.getElementById('domainScores').innerHTML=groups.map(([name,keys])=>{let n=keys.filter(k=>assessment[k]!==undefined&&assessment[k]!=='').length,p=Math.round(n/keys.length*100);return `<div class="scoreitem"><b>${p}%</b><span>${name} · ${n}/${keys.length} fields</span></div>`}).join('')}
function moduleCompletion(mod){
 const answered=mod.items.filter(([id])=>{const v=assessmentReadView()[id];return v!==undefined&&v!==null&&String(v).trim()!==''}).length;
 return {answered,total:mod.items.length,complete:answered===mod.items.length};
}
function refreshModuleProgress(){
 document.querySelectorAll('#questionModules details.module').forEach((d,i)=>{
  const mod=modules[i];if(!mod)return;
  const p=moduleCompletion(mod),chip=d.querySelector('.module-progress');
  if(chip){chip.textContent=p.complete?'Completed':(p.answered+'/'+p.total+' answered');chip.classList.toggle('complete',p.complete);chip.classList.toggle('incomplete',!p.complete)}
 });
}
function buildQuestionnaire(){
 let root=document.getElementById('questionModules');
 root.innerHTML=modules.map((mod,mi)=>{const p=moduleCompletion(mod);return `
 <details class="module" name="assessment-modules">
  <summary class="module-head">
   <span class="module-title"><span class="module-index">${String(mi+1).padStart(2,'0')}</span><strong>${escapeHTML(mod.title.replace(/^\\d+\\s*[·.]\\s*/,''))}</strong></span>
   <span class="module-head-right"><span class="module-progress ${p.complete?'complete':'incomplete'}">${p.complete?'Completed':p.answered+'/'+p.total+' answered'}</span><svg class="module-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
  </summary>
  <div class="modulebody"><div class="modulebody-inner">${mod.desc?`<p class="small">${mod.desc}</p>`:''}${mod.items.map(([id,label,type,extra])=>fieldHTML(id,label,type,extra)).join('')}</div></div>
 </details>`}).join('');
 root.querySelectorAll('details.module').forEach(d=>{
  d.addEventListener('toggle',()=>{if(d.open)root.querySelectorAll('details.module').forEach(other=>{if(other!==d)other.open=false})});
  d.addEventListener('input',refreshModuleProgress);d.addEventListener('change',refreshModuleProgress);
 });
 Object.entries(assessmentReadView()).forEach(([id,val])=>{let el=document.getElementById('q_'+id);if(el){if(el.type==='checkbox')el.checked=!!val;else el.value=val}else{let host=document.querySelector(`[data-timepicker="q_${id}"]`);if(host&&val)host.outerHTML=timePickerHTML('q_'+id,val)}});
 refreshModuleProgress();
}
function fieldHTML(id,label,type,extra){
 const definition=D4QuestionnaireRegistry.get(D4Questionnaire,id);
 if(!definition)throw new Error('Question missing from D4 registry: '+id);
 const val=assessmentReadView()[id]??'';
 const displayLabel=escapeHTML(definition.label),unit=definition.unit?` <span class="hint">Unit: ${escapeHTML(definition.unit)}</span>`:'';
 const meta=`data-question-id="${escapeHTML(definition.id)}" data-domain="${escapeHTML(definition.domain)}"`;
 if(definition.type==='time')return `<div class="field" ${meta}><label class="q">${displayLabel}</label>${timePickerHTML('q_'+id,val)}<span class="hint">Choose hour, minute and AM/PM.</span></div>`;
 if(definition.type==='select')return `<div class="field" ${meta}><label class="q" for="q_${id}">${displayLabel}</label><select id="q_${id}"><option value="">Select / skip</option>${definition.options.map(v=>`<option ${val===v?'selected':''}>${escapeHTML(v)}</option>`).join('')}</select></div>`;
 if(definition.type==='textarea')return `<div class="field" ${meta}><label class="q" for="q_${id}">${displayLabel}</label><textarea id="q_${id}" placeholder="${escapeHTML(definition.placeholder||'')}">${escapeHTML(val)}</textarea></div>`;
 return `<div class="field" ${meta}><label class="q" for="q_${id}">${displayLabel}</label><input id="q_${id}" type="${definition.type}" value="${escapeHTML(val)}" placeholder="${escapeHTML(definition.placeholder||'')}" ${definition.type==='number'?'step="any"':''}>${unit}</div>`;
}
function saveAssessment(){for(const q of D4Questionnaire.questions){if(q.type==='number'){const el=document.getElementById('q_'+q.id);if(el&&el.value.trim()!==''&&!Number.isFinite(Number(el.value))){alert('Enter a valid number for '+q.label+'.');el.focus();return}}}modules.forEach(m=>m.items.forEach(([id,label,type])=>{let el=document.getElementById('q_'+id);if(el)db.assessment[id]=el.value.trim();else if(type==='time')db.assessment[id]=getTimePicker('q_'+id)}));if(D3AssessmentIntegration.isShadowWriteEnabled(localStorage)||D3AssessmentRollout.isEnabled(localStorage)){try{db=D3AssessmentIntegration.sync(db,modules).profile}catch(e){const el=document.getElementById('d37ParityStatus');if(el)el.textContent='Structured shadow sync failed; legacy save was not written. '+(e.message||String(e));return}}saveDB();calculateScore();renderDashboard();document.getElementById('scoreOutput').innerHTML='<div class="notice">Assessment saved in this browser. These indicators describe completion, not health status.</div>'}
function calculateScore(){let assessment=assessmentReadView(),total=modules.reduce((n,m)=>n+m.items.length,0),n=Object.values(assessment).filter(v=>v!==''&&v!==null&&v!==undefined).length,p=Math.round(n/total*100);document.getElementById('scoreOutput').innerHTML=`<div class="score">${p}<span class="unit"> / 100</span></div><div class="small">Profile completion index · ${n} of ${total} fields answered. This is not a biological health score.</div>`}
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
let currentExport={name:'export.txt',content:'',type:'text/plain'};
function closeExportModal(){document.getElementById('exportModal').classList.remove('show')}
function openExportModal(title,name,content,type,mode='text'){
 currentExport={name,content,type};const modal=document.getElementById('exportModal'),txt=document.getElementById('exportText'),frame=document.getElementById('exportFrame');
 document.getElementById('exportTitle').textContent=title;document.getElementById('exportFeedback').textContent='';
 document.getElementById('exportHelp').textContent=mode==='report'?'Download the HTML report, open it in Chrome, then use Chrome menu → Print → Save as PDF. Embedded app viewers often block printing.':'Use Download file. If that fails, copy the displayed content.';
 txt.style.display=mode==='text'?'block':'none';frame.style.display=mode==='report'?'block':'none';
 document.getElementById('exportPrintBtn').style.display=mode==='report'?'inline-flex':'none';
 document.getElementById('exportOpenBtn').style.display=mode==='report'?'inline-flex':'none';
 if(mode==='text'){txt.value=content;txt.scrollTop=0}else{frame.srcdoc=content}modal.classList.add('show');
}
function download(name,content,type){try{const blob=new Blob([content],{type:type+';charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.rel='noopener';a.style.position='fixed';a.style.left='-9999px';document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(url)},30000);return true}catch(err){console.error('Download failed',err);return false}}
function downloadCurrentExport(){const mime=currentExport.name.toLowerCase().endsWith('.csv')?'text/plain':currentExport.type;const ok=download(currentExport.name,currentExport.content,mime);document.getElementById('exportFeedback').textContent=ok?'Download requested. Check the Downloads folder. If nothing appears, use Copy content.':'Download was blocked. Use Copy content or select the text below.'}
async function copyCurrentExport(){const feedback=document.getElementById('exportFeedback');try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(currentExport.content);feedback.textContent='Copied. Paste it into a file or document.';return}}catch(e){}const txt=document.getElementById('exportText');if(txt.style.display!=='none'){txt.focus();txt.select();txt.setSelectionRange(0,txt.value.length);let ok=false;try{ok=document.execCommand('copy')}catch(e){}feedback.textContent=ok?'Copied. Paste it into a file or document.':'Content selected. Long-press and choose Copy.'}else feedback.textContent='For this report, use Download file or Print / Save PDF.'}
document.getElementById('exportDownloadBtn').addEventListener('click',downloadCurrentExport);document.getElementById('exportCopyBtn').addEventListener('click',copyCurrentExport);document.getElementById('exportPrintBtn').addEventListener('click',()=>{document.getElementById('exportFeedback').textContent='Downloading the report as HTML. Open it in Chrome, then choose Print → Save as PDF.';download(currentExport.name,currentExport.content,'text/html')});
document.getElementById('exportOpenBtn').addEventListener('click',()=>{try{const blob=new Blob([currentExport.content],{type:'text/html'}),url=URL.createObjectURL(blob),w=window.open(url,'_blank');if(!w)document.getElementById('exportFeedback').textContent='Pop-up blocked. Download the HTML report and open it in Chrome.';setTimeout(()=>URL.revokeObjectURL(url),60000)}catch(e){document.getElementById('exportFeedback').textContent='Could not open report. Download it and open it in Chrome.'}});
function exportJSON(){try{saveAssessment();if(document.querySelector('#supplementCatalog [data-sup]'))saveSupplements()}catch(e){console.error('Pre-export save failed',e)}const content=JSON.stringify(db,null,2);openExportModal('Full JSON backup','bioenergetic-profile-backup-'+today()+'.json',content,'application/json','text');const el=document.getElementById('backupStatus');if(el)el.textContent='Backup prepared. Use Download file or Copy content.'}
function buildReportHTML(){
const esc=escapeHTML;let html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bioenergetic Profile Report</title><style>body{font:12px/1.5 Arial,sans-serif;color:#172027;margin:28px}h1{font-size:26px;margin:0}h2{font-size:17px;border-bottom:1px solid #bbb;padding-bottom:5px;margin-top:25px}h3{font-size:13px;margin:14px 0 4px}.meta{color:#59636b;font-size:10px}.item{padding:5px 0;border-bottom:1px solid #eee;break-inside:avoid}.key{font-weight:bold}.val{white-space:pre-wrap;overflow-wrap:anywhere}.muted{color:#66717a}.warn{background:#f3f4f4;padding:10px;margin:14px 0}.table{width:100%;border-collapse:collapse;font-size:10px}.table td,.table th{border:1px solid #ddd;padding:5px;text-align:left;vertical-align:top;white-space:normal}section{break-inside:auto}.pagebreak{break-before:page}.toolbar{position:sticky;top:0;background:#fff;padding:10px 0;border-bottom:1px solid #ddd}.toolbar button{padding:9px 14px;font-weight:bold}@media print{body{margin:14mm}.toolbar{display:none}}</style></head><body><div class="toolbar"><button onclick="window.print()">Print / Save as PDF</button> <span class="muted">Choose “Save as PDF” in the print dialog.</span></div><h1>BIOENERGETIC PROFILE</h1><div class="meta">COMPLETE PERSONAL HEALTH RECORD · Exported ${new Date().toLocaleString()}</div><div class="warn">This report contains self-reported observations and is not a medical diagnosis. Temperature and pulse are not standalone tests of thyroid function or metabolic rate.</div><h2>Baseline assessment</h2>`;
modules.forEach(mod=>{let rows=mod.items.map(([id,label])=>[label,db.assessment[id]]).filter(x=>x[1]!==undefined&&x[1]!==''&&x[1]!==null);if(rows.length)html+=`<section><h3>${esc(mod.title)}</h3>${rows.map(([k,v])=>`<div class="item"><span class="key">${esc(k)}: </span><span class="val">${esc(v)}</span></div>`).join('')}</section>`});
html+='<h2 class="pagebreak">Daily temperature & pulse logs</h2>';let logs=latestLogs();if(!logs.length)html+='<p class="muted">No daily logs recorded.</p>';logs.forEach(l=>{html+=`<h3>${esc(l.date)} · ${esc(l.method||'')} · Wake ${esc(l.wakeTime||'—')}</h3><table class="table"><tr><th>Reading</th><th>Time</th><th>Temperature °F</th><th>Pulse BPM</th></tr>${(l.measurements||[]).map(m=>`<tr><td>${esc(m.label)}</td><td>${esc(m.time||'—')}</td><td>${m.temp??'—'}</td><td>${m.pulse??'—'}</td></tr>`).join('')}</table>${l.contextTags?.length?`<p><b>Context:</b> ${esc(l.contextTags.join(', '))}</p>`:''}${l.notes?`<p><b>Notes:</b> ${esc(l.notes)}</p>`:''}`});
html+='<h2 class="pagebreak">Supplement & food inventory</h2>';let active=Object.entries(db.supplements||{}).filter(([k,v])=>v&&Object.values(v).some(x=>x!==''&&x!==null&&x!==undefined));if(!active.length)html+='<p class="muted">No supplement inventory entries recorded.</p>';else html+='<table class="table"><tr><th>Item</th><th>Status</th><th>Dose / amount</th><th>Frequency / timing</th><th>Product / notes</th></tr>'+active.map(([name,v])=>`<tr><td>${esc(name)}</td><td>${esc(v.status||'')}</td><td>${esc(v.dose||'')}</td><td>${esc(v.frequency||'')} ${esc(v.timing||'')}</td><td>${esc(v.product||'')} ${esc(v.notes||'')}</td></tr>`).join('')+'</table>';

html+='<h2 class="pagebreak">Health data · weight, sleep, symptoms and food</h2>';
let healthRows=Object.values(db.healthData?.daily||{}).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
if(!healthRows.length)html+='<p class="muted">No health data records recorded.</p>';
else healthRows.forEach(r=>{html+=`<section><h3>${esc(r.date)}</h3><div class="item"><span class="key">Weight: </span>${r.weightKg==null?'—':esc(r.weightKg)+' kg'} · <span class="key">Sleep: </span>${r.sleepHours==null?'—':esc(r.sleepHours)+' hours'} · <span class="key">Quality: </span>${esc(r.sleepQuality||'—')}</div><div class="item"><span class="key">Bedtime / wake: </span>${esc(r.bedtime||'—')} / ${esc(r.wakeTime||'—')}</div>${r.symptoms?`<div class="item"><b>Symptoms:</b> ${esc(r.symptoms)}</div>`:''}${r.food?`<div class="item"><b>Food:</b> ${esc(r.food)}</div>`:''}${r.notes?`<div class="item"><b>Notes:</b> ${esc(r.notes)}</div>`:''}</section>`});
html+='<h2>Data notes</h2><p class="muted">Records are exported from this browser. Missing values are not interpreted as normal. Preserve the JSON backup for future imports.</p></body></html>';return html}
function exportPDF(){
 try{saveAssessment();if(document.querySelector('#supplementCatalog [data-sup]'))saveSupplements();const report=buildReportHTML();
 openExportModal('Complete report · PDF / HTML','bioenergetic-profile-report-'+today()+'.html',report,'text/html','report');
 const el=document.getElementById('reportStatus');if(el)el.textContent='Complete report prepared. Download HTML, open it in Chrome, then use Print → Save as PDF.';
 }catch(err){console.error('Report export failed',err);const el=document.getElementById('reportStatus');if(el)el.textContent='Report export failed: '+(err&&err.message?err.message:'unknown error')}
}

function renderSupplements(){
 let root=document.getElementById('supplementCatalog');
 root.innerHTML=supplementCatalog.map(([name,category])=>{
  let v=db.supplements[name]||{};
  return `<details class="supp-item" data-inventory-name="${escapeHTML(name.toLowerCase())}" data-inventory-category="${escapeHTML(category)}" data-inventory-status="${escapeHTML(v.status||'Not using')}">
   <summary><strong>${escapeHTML(name)}</strong><span>${escapeHTML(category)} · ${escapeHTML(v.status||'Not logged')}</span></summary>
   <div class="supp-fields">
    <div><label class="hint">Status</label><select data-sup="${escapeHTML(name)}" data-key="status"><option ${(!v.status||v.status==='Not using')?'selected':''}>Not using</option><option ${v.status==='Currently using'?'selected':''}>Currently using</option><option ${v.status==='Prescribed and using'?'selected':''}>Prescribed and using</option><option ${v.status==='Previously used'?'selected':''}>Previously used</option><option ${v.status==='Considering'?'selected':''}>Considering</option></select></div>
    <div><label class="hint">Dose / amount</label><input data-sup="${escapeHTML(name)}" data-key="dose" value="${escapeHTML(v.dose||'')}" placeholder="e.g. 200 mg / 2 eggs / 100 g"></div>
    <div><label class="hint">Frequency</label><input data-sup="${escapeHTML(name)}" data-key="frequency" value="${escapeHTML(v.frequency||'')}" placeholder="e.g. daily / as prescribed"></div>
    <div><label class="hint">Timing</label><input data-sup="${escapeHTML(name)}" data-key="timing" value="${escapeHTML(v.timing||'')}" placeholder="With meal, morning, etc."></div>
    <div><label class="hint">Start / stop date</label><input data-sup="${escapeHTML(name)}" data-key="dates" value="${escapeHTML(v.dates||'')}" placeholder="Dates"></div>
    <div><label class="hint">Product / brand</label><input data-sup="${escapeHTML(name)}" data-key="product" value="${escapeHTML(v.product||'')}" placeholder="Optional"></div>
    <div class="wide"><label class="hint">Effects, side effects, reason or prescriber</label><textarea data-sup="${escapeHTML(name)}" data-key="notes" placeholder="Record observed effects and adverse effects">${escapeHTML(v.notes||'')}</textarea></div>
   </div></details>`;
 }).join('');
 root.querySelectorAll('details.supp-item').forEach(d=>d.addEventListener('toggle',()=>{
  if(d.open)root.querySelectorAll('details.supp-item').forEach(o=>{if(o!==d)o.open=false});
 }));
 root.querySelectorAll('[data-key="status"]').forEach(el=>el.addEventListener('change',()=>{
  const card=el.closest('.supp-item');
  card.dataset.inventoryStatus=el.value;
  const meta=card.querySelector('summary span');
  if(meta)meta.textContent=meta.textContent.split(' · ')[0]+' · '+el.value;
  filterSupplementInventory();
 }));
 filterSupplementInventory();
}
function filterSupplementInventory(){
 const root=document.getElementById('supplementCatalog');
 if(!root)return;
 const query=(document.getElementById('suppSearch')?.value||'').trim().toLowerCase();
 const category=document.getElementById('suppCategoryFilter')?.value||'';
 const status=document.getElementById('suppStatusFilter')?.value||'';
 const cards=[...root.querySelectorAll('.supp-item')];
 let visible=0,active=0;
 cards.forEach(card=>{
  const matchName=card.dataset.inventoryName.includes(query);
  const matchCategory=!category||card.dataset.inventoryCategory.toLowerCase()===category.toLowerCase();
  const matchStatus=!status||card.dataset.inventoryStatus===status;
  const show=matchName&&matchCategory&&matchStatus;
  card.hidden=!show;
  if(show)visible++;
  if(card.dataset.inventoryStatus==='Currently using'||card.dataset.inventoryStatus==='Prescribed and using')active++;
 });
 const total=document.getElementById('inventoryVisibleCount');
 const activeEl=document.getElementById('inventoryActiveCount');
 const empty=document.getElementById('inventoryNoResults');
 if(total)total.textContent=`Showing ${visible} of ${cards.length} items`;
 if(activeEl)activeEl.textContent=`${active} active`;
 if(empty)empty.hidden=visible!==0;
}
function initInventoryFilters(){
 ['suppSearch','suppCategoryFilter','suppStatusFilter'].forEach(id=>{
  const el=document.getElementById(id);
  if(el&&!el.dataset.bound){el.dataset.bound='1';el.addEventListener(id==='suppSearch'?'input':'change',filterSupplementInventory)}
 });
}
function saveSupplements(){document.querySelectorAll('#supplementCatalog [data-sup]').forEach(el=>{let n=el.dataset.sup,k=el.dataset.key;db.supplements[n] ||= {};db.supplements[n][k]=el.value});saveDB();document.getElementById('suppStatus').textContent='Supplement inventory saved locally.';renderSupplements()}
function parseSmartSupplement(raw){
 const text=String(raw||'').replace(/\r/g,'').trim();
 if(!text)return null;
 // Prefer the first non-empty row; Cronometer clipboard rows commonly use tabs or columns.
 const line=text.split('\n').map(x=>x.trim()).find(Boolean)||text;
 const amountRe=/\b(\d+(?:[.,]\d+)?)\s*(mcg|µg|μg|mg|g|drops?)\b/i;
 const match=line.match(amountRe);
 let name=line;
 let amount='';
 if(match){
  amount=(match[1].replace(',','.')+' '+match[2]).replace(/\bdrops?\b/i,'drops');
  name=(line.slice(0,match.index)+' '+line.slice(match.index+match[0].length))
    .replace(/[\t|;,]+/g,' ').replace(/\s{2,}/g,' ').replace(/^[\s:–—-]+|[\s:–—-]+$/g,'').trim();
 }else{
  name=line.replace(/[\t|;,]+/g,' ').replace(/\s{2,}/g,' ').trim();
 }
 // Remove common trailing diary metadata when no amount was found.
 name=name.replace(/\s+(?:total|logged|serving)\s*$/i,'').trim();
 if(!name)return null;
 const low=(text+' '+name).toLowerCase();
 let category='Supplement';
 if(/\b(t3|t4|liothyronine|levothyroxine|thyroid hormone|testosterone|progesterone|estradiol|dhea|pregnenolone)\b/i.test(low))category='Hormone';
 else if(/\b(prescription|medication|medicine|aspirin|metformin|antibiotic|antihistamine)\b/i.test(low))category='Prescription medicine';
 else if(/\b(milk|egg|eggs|beef|chicken|liver|rice|potato|banana|coffee|tea|juice|fruit|food|yogurt|cheese|butter)\b/i.test(low))category='Food / beverage';
 else if(/\b(other|miscellaneous)\b/i.test(low))category='Other';
 return {name,amount,category};
}
function applySmartSupplementParse(){
 const box=document.getElementById('smartSuppImport');
 const parsed=parseSmartSupplement(box.value);
 const hint=document.getElementById('smartImportHint');
 if(!parsed){hint.textContent='Paste or type an item. Name, amount and category will be filled when recognized.';return}
 const nameEl=document.getElementById('customSuppName');
 const amountEl=document.getElementById('customSuppAmount');
 const typeEl=document.getElementById('customSuppType');
 nameEl.value=parsed.name;
 if(parsed.amount)amountEl.value=parsed.amount;
 typeEl.value=parsed.category;
 [nameEl,amountEl,typeEl].forEach(el=>{el.classList.remove('parse-highlight');void el.offsetWidth;el.classList.add('parse-highlight')});
 hint.textContent='Parsed: '+parsed.name+(parsed.amount?' · '+parsed.amount:'')+' · '+parsed.category;
}
function initSmartSupplementImport(){
 const box=document.getElementById('smartSuppImport');
 if(!box||box.dataset.parserReady)return;
 box.dataset.parserReady='1';
 box.addEventListener('input',applySmartSupplementParse);
 box.addEventListener('paste',()=>setTimeout(applySmartSupplementParse,0));
}
function addCustomSupplement(){
 saveSupplements();
 const n=document.getElementById('customSuppName').value.trim();
 const amount=document.getElementById('customSuppAmount').value.trim();
 const category=document.getElementById('customSuppType').value;
 if(!n)return alert('Enter a name first.');
 if(!supplementCatalog.some(x=>x[0].toLowerCase()===n.toLowerCase())){
  supplementCatalog.push([n,category]);
  db.customSupplements ||= []; db.supplementSchedules ||= {}; db.supplementAdherence ||= {};
  db.customSupplements.push(n);
 }
 db.supplements[n] ||= {status:'Considering'};
 if(amount)db.supplements[n].dose=amount;
 saveDB();
 document.getElementById('customSuppName').value='';
 document.getElementById('customSuppAmount').value='';
 document.getElementById('smartSuppImport').value='';
 document.getElementById('smartImportHint').textContent='Added to your local inventory.';
 renderSupplements();
}


function trackerActiveItems(){
 return supplementCatalog.filter(([name])=>{
  const st=(db.supplements[name]||{}).status;
  return st==='Currently using'||st==='Prescribed and using';
 });
}
function trackerDateKey(){return selectedTrackerDate}
function trackerEntryKey(name,index){return name+'::'+index}
function renderSupplementTracker(){
 const active=trackerActiveItems(),stack=document.getElementById('activeStack');
 const list=document.getElementById('dailySupplementChecklist');
 if(!stack||!list)return;
 const date=trackerDateKey(),day=db.supplementAdherence[date]||{};
 document.getElementById('trackerDateLabel').textContent=dateLabel(date,{weekday:'short',month:'short',day:'numeric'});
 stack.innerHTML=active.length?active.map(([name,cat])=>{
  const cfg=db.supplementSchedules[name]||{};
  const inv=db.supplements[name]||{};
  return `<div class="active-stack-row"><div class="active-stack-name"><strong>${escapeHTML(name)}</strong><span>${escapeHTML(cat)} · ${escapeHTML(inv.dose||'Dose not recorded')}</span></div><label class="tracker-config"><span>Schedule</span><select data-schedule-name="${escapeHTML(name)}" data-schedule-key="frequency"><option value="daily" ${(!cfg.frequency||cfg.frequency==='daily')?'selected':''}>Daily</option><option value="weekdays" ${cfg.frequency==='weekdays'?'selected':''}>Selected days</option><option value="weekly" ${cfg.frequency==='weekly'?'selected':''}>Weekly</option><option value="as-needed" ${cfg.frequency==='as-needed'?'selected':''}>As needed</option></select></label><div class="tracker-config"><span>Reminder times</span><div class="schedule-times">${String(cfg.times||'08:00').split(',').map((t,i)=>t.trim()).filter(Boolean).map((t,i)=>`<button type="button" class="schedule-time-chip" data-schedule-time data-schedule-name="${escapeHTML(name)}" data-schedule-index="${i}" data-schedule-value="${escapeHTML(t)}">${formatClockLabel(t)}</button>`).join('')}<button type="button" class="schedule-time-add" data-add-schedule-time="${escapeHTML(name)}">+ Add time</button></div></div><label class="tracker-config"><span>Days (for selected days)</span><input data-schedule-name="${escapeHTML(name)}" data-schedule-key="days" value="${escapeHTML(cfg.days||'Mon, Tue, Wed, Thu, Fri, Sat, Sun')}" placeholder="Mon, Wed, Fri"></label></div>`;
 }).join(''):'<div class="inventory-empty">Your active stack is empty. Mark items as Currently using or Prescribed and using in the inventory to add them here.</div>';
 let doses=[];
 active.forEach(([name])=>{
  const cfg=db.supplementSchedules[name]||{frequency:'daily',times:'08:00'};
  if(cfg.frequency==='as-needed')return;
  const weekday=new Date().toLocaleDateString('en-US',{weekday:'short'});
  if(cfg.frequency==='weekdays'&&!String(cfg.days||'').toLowerCase().includes(weekday.toLowerCase()))return;
  const times=String(cfg.times||'08:00').split(',').map(x=>x.trim()).filter(x=>/^([01]\d|2[0-3]):[0-5]\d$/.test(x));
  times.forEach((time,index)=>doses.push({name,time,index,key:trackerEntryKey(name,index)}));
 });
 doses.sort((a,b)=>a.time.localeCompare(b.time)||a.name.localeCompare(b.name));
 list.innerHTML=doses.length?doses.map(d=>{
  const state=day[d.key]||{};
  return `<div class="dose-row"><div class="dose-main"><strong>${escapeHTML(d.name)}</strong><span>${d.time} · ${escapeHTML((db.supplements[d.name]||{}).dose||'Dose not specified')}</span></div><div class="dose-actions"><button type="button" data-dose-state="taken" data-dose-key="${escapeHTML(d.key)}" class="${state.status==='taken'?'selected taken':''}">Taken</button><button type="button" data-dose-state="skipped" data-dose-key="${escapeHTML(d.key)}" class="${state.status==='skipped'?'selected':''}">Skipped</button><button type="button" data-dose-state="missed" data-dose-key="${escapeHTML(d.key)}" class="${state.status==='missed'?'selected':''}">Missed</button></div></div>`;
 }).join(''):'<div class="inventory-empty">No doses scheduled for today. Configure a schedule above, or use As needed for non-routine items.</div>';
 const logged=doses.filter(d=>day[d.key]?.status).length;
 const pct=doses.length?Math.round(logged/doses.length*100):0;
 document.getElementById('trackerProgressFill').style.width=pct+'%';
 document.getElementById('trackerProgressText').textContent=`${logged} / ${doses.length} doses logged`;
 const history=Object.keys(db.supplementAdherence||{}).sort().slice(-7).reverse();
 document.getElementById('trackerHistory').innerHTML=history.length?'<div class="small">Recent adherence records</div>'+history.map(d=>{const vals=Object.values(db.supplementAdherence[d]||{});const taken=vals.filter(x=>x.status==='taken').length;return `<div class="history-row"><span>${d}</span><span>${taken} taken · ${vals.length-taken} skipped/missed or other</span></div>`}).join(''):'';
}
function initSupplementTracker(){
 const root=document.getElementById('supplements');
 if(!root||root.dataset.trackerBound)return;
 root.dataset.trackerBound='1';
 root.addEventListener('change',e=>{
  const el=e.target.closest('[data-schedule-name]');
  if(!el)return;
  const name=el.dataset.scheduleName,key=el.dataset.scheduleKey;
  db.supplementSchedules[name] ||= {frequency:'daily',times:'08:00',days:'Mon, Tue, Wed, Thu, Fri, Sat, Sun'};
  db.supplementSchedules[name][key]=el.value;
  saveDB();renderSupplementTracker();
 });
 root.addEventListener('click',e=>{
  const btn=e.target.closest('[data-dose-state]');
  if(!btn)return;
  const date=trackerDateKey(),key=btn.dataset.doseKey;
  db.supplementAdherence[date] ||= {};
  db.supplementAdherence[date][key]={status:btn.dataset.doseState,loggedAt:new Date().toISOString()};
  saveDB();renderSupplementTracker();
 });
}

function parseGlobalSupplementLine(raw){
 const text=String(raw||'').replace(/\s+/g,' ').trim();
 if(!text)return {error:'Paste or type an entry first.'};
 const cards=[...document.querySelectorAll('#supplementCatalog details.supp-item')];
 const candidates=cards.map(card=>({card,name:card.querySelector('summary strong')?.textContent.trim()||''}))
  .filter(x=>x.name)
  .sort((a,b)=>b.name.length-a.name.length);
 const escaped=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 let found=null;
 for(const item of candidates){
  const re=new RegExp('(^|[^a-z0-9])'+escaped(item.name)+'(?=$|[^a-z0-9])','i');
  if(re.test(text)){found=item;break}
 }
 if(!found){
  const typed=text.match(/^([a-z][a-z0-9+()\- ]{1,35}?)(?=\s+\d|\s+(?:daily|weekly|once|twice|three times|with|on waking|before|after)\b|$)/i);
  const guess=typed?.[1]?.trim();
  return {error:guess?'No inventory row matched “'+guess+'”. Add it under “Add something not listed” first.':'Could not identify a supplement name in the inventory.'};
 }
 let remainder=text.replace(new RegExp('(^|[^a-z0-9])'+escaped(found.name)+'(?=$|[^a-z0-9])','i'),' ').replace(/\s+/g,' ').trim();
 const amountMatch=remainder.match(/\b\d+(?:[.,]\d+)?\s*(?:mcg|µg|μg|mg|g|ml|mL|iu|units?|drops?)\b/i);
 const amount=amountMatch?amountMatch[0].replace(/\s+/g,' ').trim():'';
 if(amountMatch)remainder=remainder.replace(amountMatch[0],' ');
 const frequencyRe=/\b(?:once|twice|three times|four times)\s+(?:a|per)\s+day\b|\b\d+\s*(?:x|times?)\s*(?:\/|per)\s*day\b|\b(?:daily|every day|every other day|weekly|once a week|twice a week|monthly)\b/i;
 const frequencyMatch=remainder.match(frequencyRe);
 const frequency=frequencyMatch?frequencyMatch[0]:'';
 if(frequencyMatch)remainder=remainder.replace(frequencyMatch[0],' ');
 const timingRe=/\b(?:with|before|after)\s+(?:a\s+)?(?:meal|food|breakfast|lunch|dinner|bed|sleep)\b|\b(?:on waking|upon waking|empty stomach|at bedtime|in the morning|in the evening|morning|evening|night)\b/i;
 const timingMatch=remainder.match(timingRe);
 const timing=timingMatch?timingMatch[0]:'';
 if(timingMatch)remainder=remainder.replace(timingMatch[0],' ');
 const product=remainder.replace(/\b(?:take|taking|dose|dosage|supplement|of|and|then)\b/ig,' ')
  .replace(/[()[\],;|]/g,' ').replace(/\s+/g,' ').replace(/^[\s:–—-]+|[\s:–—-]+$/g,'').trim();
 return {card:found.card,name:found.name,amount,frequency,timing,product};
}
function applyGlobalSupplementLog(){
 const input=document.getElementById('globalSuppLog'),status=document.getElementById('globalSuppStatus');
 const parsed=parseGlobalSupplementLine(input.value);
 if(parsed.error){status.textContent=parsed.error;return}
 const card=parsed.card;
 if(!card.open)card.open=true;
 const set=(key,value)=>{if(!value)return;const el=card.querySelector(`[data-key="${key}"]`);if(el)el.value=value};
 set('status','Currently using');set('dose',parsed.amount);set('frequency',parsed.frequency);set('timing',parsed.timing);set('product',parsed.product);
 card.classList.remove('quick-log-hit');void card.offsetWidth;card.classList.add('quick-log-hit');
 card.scrollIntoView({behavior:'smooth',block:'center'});
 status.textContent='Matched '+parsed.name+'. Fields filled; review them, then save your supplement inventory.';
 window.setTimeout(()=>card.classList.remove('quick-log-hit'),2200);
}
function initGlobalSupplementLog(){
 const input=document.getElementById('globalSuppLog'),button=document.getElementById('globalSuppParse');
 if(!input||input.dataset.ready)return;
 input.dataset.ready='1';
 input.addEventListener('input',()=>{
  const parsed=parseGlobalSupplementLine(input.value);
  if(parsed.card)applyGlobalSupplementLog();
  else document.getElementById('globalSuppStatus').textContent=parsed.error||'';
 });
 input.addEventListener('paste',()=>setTimeout(()=>{const parsed=parseGlobalSupplementLine(input.value);if(parsed.card)applyGlobalSupplementLog()},0));
 button?.addEventListener('click',applyGlobalSupplementLog);
}

function exportCSV(){
 try{
  const rows=[['date','wake_time','method','measurement','time','temperature_f','pulse_bpm','notes']];
  latestLogs().forEach(l=>{(Array.isArray(l.measurements)?l.measurements:[]).forEach(m=>rows.push([l.date||'',l.wakeTime||'',l.method||'',m.label||'',m.time||'',m.temp??'',m.pulse??'',l.notes||'']))});
  const csv='\ufeff'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
  openExportModal('Daily logs · CSV','bioenergetic-daily-logs-'+today()+'.csv',csv,'text/plain','text');
  const el=document.getElementById('reportStatus');if(el)el.textContent='CSV prepared. Tap Download file. '+(rows.length-1)+' measurement rows included.';
 }catch(err){console.error('CSV export failed',err);const el=document.getElementById('reportStatus');if(el)el.textContent='CSV export failed: '+(err&&err.message?err.message:'unknown error')}
}
function importJSON(e){let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{let x=JSON.parse(r.result);if(!x.logs||!x.assessment)throw Error('Invalid backup');x.supplements ||= {};x.customSupplements ||= [];db=x; supplementCatalog.splice(baseSupplementCount);db.customSupplements.forEach(n=>{if(!supplementCatalog.some(x=>x[0].toLowerCase()===n.toLowerCase()))supplementCatalog.push([n,'Custom'])});saveDB();renderDashboard();renderTrends();renderSupplements();document.getElementById('backupStatus').textContent='Backup imported.'}catch(err){document.getElementById('backupStatus').textContent='Could not import: invalid backup file.'}};r.readAsText(f)}
function assessmentReadView(){const view=Object.assign({},db.assessment||{});if(D3AssessmentRollout.isEnabled(localStorage)){const structured=D3AssessmentRollout.readView(db,modules,localStorage);Object.assign(view,structured)}return view}
function d36SetShadowWrites(enabled){try{D3AssessmentIntegration.setShadowWriteEnabled(localStorage,enabled);const el=document.getElementById('d37ParityStatus');if(el)el.textContent=enabled?'Structured shadow writes enabled. Legacy fields remain unchanged and authoritative.':'Structured shadow writes disabled.'}catch(e){const toggle=document.getElementById('d36ShadowWriteToggle');if(toggle)toggle.checked=false;const el=document.getElementById('d37ParityStatus');if(el)el.textContent='Could not change shadow-write setting: '+(e.message||String(e))}}
function d37RunParity(){const el=document.getElementById('d37ParityStatus');try{const r=D3AssessmentRollout.compare(db,modules);el.textContent='LOCAL PARITY CHECK\nQuestions checked: '+r.checked+'\nMatched: '+r.matched+'\nMismatches: '+r.mismatchCount+'\nResult: '+(r.passed?'PASS':'FAIL')+(r.mismatches.length?'\n\nMismatching IDs:\n'+r.mismatches.map(x=>x.id+' (legacy: '+x.legacyStatus+', structured: '+x.structuredStatus+')').join('\n'):'\n\nAll active questionnaire fields match. No remote data is sent.')}catch(e){el.textContent='Parity check failed: '+(e.message||String(e))}}
function d39EnableReads(){const el=document.getElementById('d37ParityStatus');try{const gate=D3AssessmentRollout.canEnable(db,modules);if(!gate.allowed){el.textContent='STRUCTURED READS NOT ENABLED\nSchema valid: '+gate.valid+'\nStructured store present: '+gate.hasStructuredStore+'\nParity: '+(gate.parity.passed?'PASS':'FAIL')+'\nMismatches: '+gate.parity.mismatchCount+'\nRun shadow writes and resolve every mismatch before enabling.';return}if(!confirm('Enable structured reads for questionnaire display and completion indicators? Legacy answers remain stored.'))return;D3AssessmentRollout.setEnabled(localStorage,true,db,modules);el.textContent='Structured reads enabled. Legacy fields remain preserved. Reloading…';setTimeout(()=>location.reload(),500)}catch(e){el.textContent='Could not enable structured reads: '+(e.message||String(e))}}
function d39DisableReads(){try{D3AssessmentRollout.setEnabled(localStorage,false,db,modules);const el=document.getElementById('d37ParityStatus');if(el)el.textContent='Legacy reads restored. Reloading…';setTimeout(()=>location.reload(),300)}catch(e){const el=document.getElementById('d37ParityStatus');if(el)el.textContent='Could not restore legacy reads: '+(e.message||String(e))}}
document.addEventListener('DOMContentLoaded',()=>{const t=document.getElementById('d36ShadowWriteToggle');if(t)t.checked=D3AssessmentIntegration.isShadowWriteEnabled(localStorage)});
function d3Status(message){const el=document.getElementById('d3MigrationStatus');if(el)el.textContent=message}
function d3DownloadBackup(json,name){const blob=new Blob([json],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}
function d3PreviewMigration(){try{const r=D3AssessmentBridge.preview(db);const b=r.before,a=r.after;d3Status('PREVIEW ONLY — no data written\n\nLegacy answers: '+b.legacyQuestionCount+'\nStructured answers after migration: '+a.structuredAnswerCount+'\nUnmapped legacy keys: '+a.legacyKeysWithoutStructuredAnswer.length+'\nValidation: '+(r.safeToProceed?'PASS':'FAIL')+'\n'+(r.validation.errors||[]).join('\n'))}catch(e){d3Status('Preview failed: '+(e.message||String(e)))}}
function d3RunMigration(){const previous=db;try{const r=D3AssessmentBridge.migrateWithBackup(db);d3DownloadBackup(r.backup,r.backupName);if(!confirm('A complete pre-migration backup download was triggered. Continue and save the migrated copy in this browser? Keep the downloaded backup.'))return;db=r.migratedProfile;try{saveDB()}catch(e){db=previous;throw Error('Storage write failed; original in-memory profile restored. '+e.message)}try{D3AssessmentBridge.setEnabled(localStorage,false)}catch(_){}try{D3AssessmentRollout.setEnabled(localStorage,false,db,modules)}catch(_){}try{D3AssessmentIntegration.setShadowWriteEnabled(localStorage,false)}catch(_){}d3Status('MIGRATION SAVED\nLegacy answers: '+r.summary.before.legacyQuestionCount+'\nStructured answers: '+r.summary.after.structuredAnswerCount+'\nLegacy answers retained. Structured reads remain disabled. Reloading the app…');setTimeout(()=>location.reload(),1200)}catch(e){db=previous;d3Status('Migration stopped: '+(e.message||String(e)))}}
function d3RollbackMigration(event){const file=event.target.files&&event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const previous=db;try{const restored=D3AssessmentBridge.rollbackFromBackup(String(reader.result));if(!confirm('Replace the current browser profile with this backup? Changes since the backup will be lost.'))return;db=restored;saveDB();try{D3AssessmentBridge.setEnabled(localStorage,false)}catch(_){}try{D3AssessmentRollout.setEnabled(localStorage,false,db,modules)}catch(_){}try{D3AssessmentIntegration.setShadowWriteEnabled(localStorage,false)}catch(_){}d3Status('Rollback saved. Reloading…');setTimeout(()=>location.reload(),800)}catch(e){db=previous;d3Status('Rollback failed; current profile retained. '+(e.message||String(e)))}finally{event.target.value=''}};reader.onerror=()=>d3Status('Could not read the selected backup.');reader.readAsText(file)}
function deleteAll(){if(confirm('Delete all assessment answers and daily logs from this browser? This cannot be undone.')){localStorage.removeItem(DBKEY);db={logs:{},assessment:{},supplements:{},customSupplements:[]};supplementCatalog.splice(baseSupplementCount);buildQuestionnaire();renderSupplements();renderDashboard();renderTrends();document.getElementById('backupStatus').textContent='Local data deleted.'}}
buildMeasurementRows();document.getElementById('logDate').value=today();document.getElementById('logDateLabel').textContent=dateLabel(today());document.getElementById('tempUnit').value='F';document.getElementById('hdDate').value=today();buildQuestionnaire();renderSupplements();renderDashboard();renderTrends();renderHealthData();window.addEventListener('resize',()=>{renderDashboard();renderTrends();if(document.getElementById('healthdata').classList.contains('active'))renderHealthData(false)});
initSmartSupplementImport();
initGlobalSupplementLog();
initInventoryFilters();
initSupplementTracker();
