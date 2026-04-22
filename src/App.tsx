/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  ChevronRight, 
  X, 
  Type, 
  Calendar, 
  Clock, 
  Tag, 
  Info,
  User,
  Filter,
  Check,
  Sword
} from 'lucide-react';

// Types
interface Event {
  id: string;
  category: string;
  start: string;
  end: string;
  title: string;
  preview: string;
  details: string;
  poc: string;
  speaker?: string;
  verse?: string;
  goal?: string;
  pptUrl?: string;
}

const BIBLE_VERSES: Record<string, string> = {
  'Isaiah 59:2': 'But your iniquities have separated you from your God; And your sins have hidden His face from you, So that He will not hear.',
  'Romans 3:23': 'for all have sinned and fall short of the glory of God,',
  'Romans 6:23': 'For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.',
  'Romans 5:8': 'But God demonstrates His own love toward us, in that while we were still sinners, Christ died for us.',
  'John 3:16': 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.',
  '2 Corinthians 5:17': 'Therefore, if anyone is in Christ, he is a new creation; old things have passed away; behold, all things have become new.',
  'Philippians 1:20–21': 'according to my earnest expectation and hope that in nothing I shall be ashamed, but with all boldness, as always, so now also Christ will be magnified in my body, whether by life or by death. For to me, to live is Christ, and to die is gain.',
  'Judges 21:25': 'In those days there was no king in Israel; everyone did what was right in his own eyes.',
  'Philippians 1:20': 'according to my earnest expectation and hope that in nothing I shall be ashamed, but with all boldness, as always, so now also Christ will be magnified in my body, whether by life or by death.',
  'Philippians 1:9–10': 'And this I pray, that your love may abound still more and more in knowledge and all discernment, that you may approve the things that are excellent, that you may be sincere and without offense till the day of Christ,',
  'Ephesians 3:17': 'that Christ may dwell in your hearts through faith; that you, being rooted and grounded in love,',
  'Colossians 2:6–7': 'As you therefore have received Christ Jesus the Lord, so walk in Him, rooted and built up in Him and established in the faith, as you have been taught, abounding in it with thanksgiving.',
  '1 John 4:7–8': 'Beloved, let us love one another, for love is of God; and everyone who loves is born of God and knows God. He who does not love does not know God, for God is love.',
  'Ephesians 6:17': 'And take the helmet of salvation, and the sword of the Spirit, which is the word of God;',
  'Hebrews 5:14': 'But solid food belongs to those who are of full age, that is, those who by reason of use have their senses exercised to discern both good and evil.',
  'Romans 12:1–2': 'I beseech you therefore, brethren, by the mercies of God, that you present your bodies a living sacrifice, holy, acceptable to God, which is your reasonable service. And do not be conformed to this world, but be transformed by the renewing of your mind, that you may prove what is that good and acceptable and perfect will of God.',
  'Ephesians 4:22–24': 'that you put off, concerning your former conduct, the old man which grows corrupt according to the deceitful lusts, and be renewed in the spirit of your mind, and that you put on the new man which was created according to God, in true righteousness and holiness.',
  'Psalm 51:10': 'Create in me a clean heart, O God, And renew a steadfast spirit within me.',
  'John 1:1': 'In the beginning was the Word, and the Word was with God, and the Word was God.',
  'John 14:15': 'If you love Me, keep My commandments.',
  'Matthew 22:36–39': '“Teacher, which is the great commandment in the law?” Jesus said to him, “‘You shall love the Lord your God with all your heart, with all your soul, and with all your mind.’ This is the first and great commandment. And the second is like it: ‘You shall love your neighbor as yourself.’”',
  'Romans 3:23–26': 'for all have sinned and fall short of the glory of God, being justified freely by His grace through the redemption that is in Christ Jesus, whom God set forth as a propitiation by His blood, through faith, to demonstrate His righteousness, because in His forbearance God had passed over the sins that were previously committed, to demonstrate at the present time His righteousness, that He might be just and the justifier of the one who has faith in Jesus.',
  'Luke 9:23': 'Then He said to them all, “If anyone desires to come after Me, let him deny himself, and take up his cross daily, and follow Me.',
  'Philippians 1:27': 'Only let your conduct be worthy of the gospel of Christ, so that whether I come and see you or am absent, I may hear of your affairs, that you stand fast in one spirit, with one mind striving together for the faith of the gospel,',
  'Philippians 1:27–28': 'Only let your conduct be worthy of the gospel of Christ, so that whether I come and see you or am absent, I may hear of your affairs, that you stand fast in one spirit, with one mind striving together for the faith of the gospel, and not in any way terrified by your adversaries, which is to them a proof of perdition, but to you of salvation, and that from God.',
  'Philippians 1:13': 'so that it has become evident to the whole palace guard, and to all the rest, that my chains are in Christ;',
  '1 Timothy 6:12': 'Fight the good fight of faith, lay hold on eternal life, whereunto thou art also called.',
};

interface Day {
  id: string;
  label: string;
  date: string;
  theme: string;
  events: Event[];
}

const INITIAL_DATA: Day[] = [
  {
    id: 'day1',
    label: 'Day 1',
    date: 'April 29',
    theme: 'April 29 - 1st Day',
    events: [
      { id: 'd1e1', category: 'Arrival', start: '8:00 AM', end: '9:00 AM', title: 'Registration & Check-In', preview: 'Campers arrive, register, receive kits, and get room assignments.', details: 'Campers arrive, register, receive kits, and get room assignments. Each camper will be greeted by the welcome team and guided to their designated quarters.', poc: 'Joy and Princess' },
      { id: 'd1e2', category: 'Orientation', start: '9:00 AM', end: '10:30 AM', title: 'Camp Orientation', preview: 'Introduction to camp schedule, rules, and the Battle Royale.', details: 'Introduction to camp schedule, house rules, and safety protocols. Announcement of the Battle Royale competition details, team names, theme song, and chants.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd1e3', category: 'Games', start: '10:30 AM', end: '12:00 PM', title: 'Indoor Game', preview: 'Fun group games and Bible challenges to break the ice.', details: 'High-energy indoor games designed to foster teamwork and familiarity among campers. Includes Bible-themed trivia and physical challenges.', poc: 'Beth' },
      { id: 'd1e4', category: 'Meal', start: '12:00 PM', end: '1:00 PM', title: 'Lunch', preview: 'Lunch break.', details: 'Commanders, ensure your team is complete and properly lined up in front of the canteen at least 5 minutes before lunchtime. Please check that all members are present before forming the line so we can keep the schedule organized.', poc: 'ER' },
      { 
        id: 'd1e5', 
        category: 'Lesson', 
        start: '1:00 PM', 
        end: '2:00 PM', 
        title: 'Lesson 1 — Eyes Locked in the Battle', 
        preview: 'Speaker: Pastor John Boromeo', 
        details: `
          <div class="space-y-8">
            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">1. We Are Lost Without Christ</h4>
              <ul class="space-y-2 text-lg text-stone-700 font-medium">
                <li>• Sin is not just bad behavior—it is separation from God.</li>
                <li>• Sin began with Adam and Eve (Genesis 3).</li>
                <li>• Every person starts with a broken condition before God.</li>
                <li class="bg-red-50 p-4 rounded-xl mt-4 italic font-bold">Key Truth: We cannot win the battle of life if we are still separated from God.</li>
              </ul>
              
              <div class="mt-6 flex flex-wrap gap-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-stone-400 w-full mb-1">Key Verses (Click to Read):</span>
                <button class="verse-btn" data-verse="Isaiah 59:2">Isaiah 59:2</button>
                <button class="verse-btn" data-verse="Romans 3:23">Romans 3:23</button>
                <button class="verse-btn" data-verse="Romans 6:23">Romans 6:23</button>
                <button class="verse-btn" data-verse="Romans 5:8">Romans 5:8</button>
                <button class="verse-btn" data-verse="John 3:16">John 3:16</button>
              </div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">2. New Identity in Christ</h4>
              <ul class="space-y-2 text-lg text-stone-700 font-medium">
                <li>• When someone encounters Christ, their identity changes.</li>
                <li>• Salvation is not self-improvement—it is transformation.</li>
                <li>• Paul could face prison without shame because Christ changed his life.</li>
                <li class="bg-red-50 p-4 rounded-xl mt-4 italic font-bold">Key Truth: Following Christ means the old identity dies and a new life begins.</li>
              </ul>
              <div class="mt-4 flex flex-wrap gap-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-stone-400 w-full mb-1">Key Verse:</span>
                <button class="verse-btn" data-verse="2 Corinthians 5:17">2 Corinthians 5:17</button>
              </div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">3. Focus on Christ and Live What You Are</h4>
              <ul class="space-y-2 text-lg text-stone-700 font-medium">
                <li>• Paul’s life had one focus: Christ must be magnified.</li>
                <li>• The word <strong>Apokaradokia</strong> describes someone stretching forward, fixing their eyes on something ahead.</li>
                <li>• Paul fixed his eyes on Christ whether he lived or died.</li>
                <li class="bg-red-50 p-4 rounded-xl mt-4 italic font-bold">Key Truth: A Christian lives with eyes locked on Christ and a life surrendered to Him.</li>
              </ul>
              <div class="mt-4 flex flex-wrap gap-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-stone-400 w-full mb-1">Key Verse:</span>
                <button class="verse-btn" data-verse="Philippians 1:20–21">Philippians 1:20–21</button>
              </div>
            </section>

            <section class="mt-12 p-8 bg-stone-900 rounded-[2rem] text-white">
              <h4 class="text-xs font-black uppercase tracking-[0.2em] text-[#ff533d] mb-4">Lesson Summary (for Facilitators)</h4>
              <p class="text-stone-300 leading-relaxed font-medium">
                This lesson helps campers understand the real battle of life. Before we can fight for Christ, we must understand that we were lost because of sin, but through Christ we receive a new identity. Like Paul, believers must live with their eyes fixed on Christ, allowing Him to be glorified in everything.
              </p>
            </section>
          </div>
        `, 
        poc: 'Pastor John Boromeo',
        speaker: 'Pastor John Boromeo',
        verse: 'Philippians 1:20–21',
        goal: 'Introduce the Gospel clearly and help campers understand that sin separates them from God. Lead them to see that true identity is found only in Christ.'
      },
      { 
        id: 'd1e6', 
        category: 'Circle', 
        start: '2:00 PM', 
        end: '3:00 PM', 
        title: 'EMPOWER CIRCLE 1 — Locked In', 
        preview: 'The Beginning of the Battle', 
        details: `
          <div class="space-y-4">
            <div class="p-8 bg-stone-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <h4 class="text-xs font-black uppercase tracking-[0.3em] text-[#ff533d] mb-4 block">Session Goal</h4>
              <ul class="space-y-2 text-stone-300 font-bold">
                <li>1. Clearly understand the Gospel and salvation.</li>
                <li>2. Opportunity for the unsaved to respond to Christ.</li>
                <li>3. Help believers understand that salvation is a new mission.</li>
              </ul>
            </div>

            <section class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div class="p-6 border-b border-stone-50 bg-stone-50/50">
                <h4 class="text-xl font-black text-stone-900 uppercase tracking-tight">Counselor Instructions</h4>
              </div>
              <div class="p-8 space-y-6">
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">1. Set the Tone (5–10 mins)</h5>
                  <p class="text-stone-700 font-medium italic">"After the lesson kanina tungkol sa battle, gusto lang nating pag-usapan kung nasaan tayo personally sa relationship natin kay Christ."</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">2. Explain the Gospel Clearly (10–15 mins)</h5>
                  <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <li class="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-sm font-bold">• God created us for relationship.</li>
                    <li class="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-sm font-bold">• Sin separated us from God.</li>
                    <li class="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-sm font-bold">• Jesus died and rose to save us.</li>
                    <li class="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-sm font-bold">• Salvation is by grace through faith.</li>
                  </ul>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">3. Personal Reflection (15–20 mins)</h5>
                  <p class="text-sm text-stone-600 font-medium">Ask questions that help them examine their own faith. Give them space to talk.</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">4. If Not Sure About Salvation</h5>
                  <p class="text-sm text-stone-600 font-medium italic">Explain: Not church attendance, ministry, or good works. It is personal surrender and faith.</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">5. For Those Already Saved</h5>
                  <p class="text-sm text-stone-600 font-medium italic">"Kung saved ka na… ano na ang next step?" Start the mission: Follow, Grow, Live, Influence.</p>
                </div>
              </div>
            </section>

            <section class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div class="p-6 border-b border-stone-50 bg-stone-50/50">
                <h4 class="text-xl font-black text-stone-900 uppercase tracking-tight">Discussion Questions</h4>
                <p class="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 italic">Note: Choose 1-2 questions only that you see suitable for your group.</p>
              </div>
              <div class="p-8 space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                    <h5 class="font-black text-stone-900 border-b border-stone-200 pb-2 mb-4 uppercase text-xs italic">Grade School</h5>
                    <ul class="space-y-2 text-sm font-medium text-stone-700">
                      <li>1. Sino si Jesus para sa'yo?</li>
                      <li>2. Alam mo ba kung bakit namatay si Jesus sa cross?</li>
                      <li>3. Ano ang ibig sabihin ng pagiging “saved”?</li>
                      <li>4. Kung mahal mo si Jesus, anong gusto mong gawin para sa Kanya?</li>
                    </ul>
                  </div>
                  <div class="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                    <h5 class="font-black text-stone-900 border-b border-stone-200 pb-2 mb-4 uppercase text-xs italic">High School</h5>
                    <ul class="space-y-2 text-sm font-medium text-stone-700">
                      <li>1. Difference ng knowing about Jesus vs personally trusting Jesus?</li>
                      <li>2. Bakit maraming nasa church pero hindi kilala si Christ?</li>
                      <li>3. Paano ba maliligtas? Kaya mo ba itong ipaliwanag?</li>
                      <li>4. Anong area ng buhay mo ang kailangan pang magbago?</li>
                    </ul>
                  </div>
                  <div class="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                    <h5 class="font-black text-stone-900 border-b border-stone-200 pb-2 mb-4 uppercase text-xs italic">College</h5>
                    <ul class="space-y-2 text-sm font-medium text-stone-700">
                      <li>1. Kailan mo masasabi na personal na ang faith mo?</li>
                      <li>2. Bakit nahihirapan ang tao mag-surrender kay Christ?</li>
                      <li>3. Paano dapat makita ang salvation sa lifestyle?</li>
                      <li>4. God’s purpose for your life now that you know Christ?</li>
                    </ul>
                  </div>
                  <div class="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                    <h5 class="font-black text-stone-900 border-b border-stone-200 pb-2 mb-4 uppercase text-xs italic">Working</h5>
                    <ul class="space-y-2 text-sm font-medium text-stone-700">
                      <li>1. Kailan mo na-realize na kailangan mo si Christ?</li>
                      <li>2. Difference ng religion at relationship with Christ?</li>
                      <li>3. Paano ka ginagamit ni God sa trabaho/pamilya?</li>
                      <li>4. Next spiritual step after this camp?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div class="p-6 border-b border-stone-50 bg-stone-50/50">
                <h4 class="text-xl font-black text-stone-900 uppercase tracking-tight">Closing & Resources</h4>
              </div>
              <div class="p-8 space-y-4">
                <div class="p-6 bg-red-50 rounded-3xl border border-red-100">
                  <p class="text-stone-800 font-bold italic mb-4">“The battle of life cannot even begin unless we belong to the King.”</p>
                  <p class="text-sm text-stone-600 mb-4 font-medium italic">Lead them to reflect: “Do I truly belong to Christ?”</p>
                  <div class="flex flex-col sm:flex-row gap-4">
                    <a href="https://canva.link/xmyzxmjo48n2248" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800 transition-colors shadow-lg">
                      Salvation Illustration (Canva)
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        `, 
        poc: 'Pastor Joseph and Pastor Paul' 
      },
      { id: 'd1e7', category: 'Team', start: '3:00 PM', end: '5:00 PM', title: 'Team Formation', preview: 'Teams organize and build team identity.', details: 'Teams work on their banners, war cries, and identity. This time is crucial for establishing team synergy for the coming competitions.', poc: 'Beth' },
      { id: 'd1e8', category: 'Free Time', start: '5:00 PM', end: '6:00 PM', title: 'Free Time', preview: 'Rest, refresh, or connect with other campers.', details: 'Unstructured time for campers to rest, shower, or engage in personal prayer and reflection.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd1e9', category: 'Meal', start: '6:00 PM', end: '7:00 PM', title: 'Dinner', preview: 'Dinner break.', details: 'Commanders, make sure your team is complete and lined up in front of the canteen at least 5 minutes before dinner time. Kindly confirm that all members are present before lining up.', poc: 'ER' },
      { id: 'd1e10', category: 'Worship', start: '7:00 PM', end: '8:30 PM', title: 'Worship Night', preview: 'High-energy praise and worship.', details: 'A vibrant concert-style worship experience led by the Empower Worship Team, focusing on exuberant praise.', poc: 'Pastor Amoz and Jeem' },
      { 
        id: 'd1e11', 
        category: 'Lesson', 
        start: '8:30 PM', 
        end: '9:30 PM', 
        title: 'Lesson 2 — My Body, His Choice', 
        preview: 'Speaker: Pastor Jerald Sardiña', 
        details: `
          <div class="space-y-8">
            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">Our Culture’s Definition of Freedom</h4>
              <p class="text-lg text-stone-700 font-medium mb-4 italic">
                "Kakayanang magawa ang gusto kong gawin kung kanino ko gustong gawin kung kelan o saan ko gustong gawin sa paraan na gusto kong gawin nang di napipigilan."
              </p>
              <p class="text-stone-600 font-medium">This reflects a mindset where personal desire becomes the highest authority.</p>
              <div class="bg-red-50 p-4 rounded-xl mt-4 italic font-bold">Key Truth: When personal desire becomes king, God is pushed out of authority.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">The Biblical Picture of a Godless Society</h4>
              <div class="space-y-4 mb-6">
                <button class="verse-btn" data-verse="Judges 21:25">Judges 21:25</button>
                <ul class="space-y-2 text-lg text-stone-700 font-medium list-disc ml-6">
                  <li>Walang hari sa Israel nung time na yun.</li>
                  <li>Ginagawa ng mga tao kung anong tama sa tingin nila.</li>
                </ul>
              </div>
              <p class="text-stone-600 font-medium">When God is not recognized as King, people begin to follow their own standard of right and wrong.</p>
              <div class="bg-red-50 p-4 rounded-xl mt-4 italic font-bold">Key Truth: When God is not our King, we eventually become our own king.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">The Christian Perspective of the Body</h4>
              <div class="mb-6">
                <button class="verse-btn" data-verse="Philippians 1:20">Philippians 1:20</button>
              </div>
              <p class="text-stone-700 font-medium text-lg italic mb-4">“…with all boldness, Christ will even now, as always, be exalted in my body, whether by life or by death.”</p>
              <p class="text-stone-600 font-medium">For the believer, the body is not primarily for self-expression, but for Christ’s exaltation.</p>
              <div class="bg-red-50 p-4 rounded-xl mt-4 italic font-bold">Key Truth: The Christian body is not for self-glory but for Christ’s glory.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">The Meaning of Following Christ</h4>
              <p class="text-lg text-stone-700 font-medium mb-4">To follow Christ means that life becomes centered on Him.</p>
              <ul class="space-y-2 text-lg text-stone-700 font-bold mb-4">
                <li>• To be all about Christ in the good times and the bad, in the highs and lows.</li>
                <li>• To be more of Him and less of us.</li>
                <li>• To be all of Him and none of us.</li>
              </ul>
              <div class="bg-red-50 p-4 rounded-xl mt-4 italic font-bold">Key Truth: Following Christ means Christ becomes the center of our identity and decisions.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">The Modern Idols of Christians</h4>
              <p class="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Makabagong diosdiosan ng mga Christians:</p>
              <div class="flex gap-4 mb-6">
                <div class="bg-stone-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest">Comfort</div>
                <div class="bg-stone-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest">Self-Preservation</div>
              </div>
              <p class="text-stone-600 font-medium">Instead of surrendering everything to Christ, believers sometimes choose comfort and safety over obedience.</p>
              <div class="bg-red-50 p-4 rounded-xl mt-4 italic font-bold">Key Truth: Comfort and safety can quietly replace Christ as the center of our lives.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">Battle Perspective</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed">
                A life that follows Christ will face struggles, sacrifices, and challenges. But those struggles become a testimony.
                <br /><br />
                <span class="text-2xl font-black text-[#ff533d] uppercase leading-tight italic block">"Your battle scars will be His best storyteller."</span>
                <br />
                Faithfulness to Christ may leave marks on our lives, but those marks become evidence that Christ is worth living for.
              </p>
              <div class="bg-red-50 p-4 rounded-xl mt-4 italic font-bold">Key Truth: The scars of obedience often become the strongest testimony of a life lived for Christ.</div>
            </section>

            <section class="mt-12 p-8 bg-stone-900 rounded-[2rem] text-white">
              <h4 class="text-xs font-black uppercase tracking-[0.2em] text-[#ff533d] mb-4">Lesson Summary (for Facilitators)</h4>
              <p class="text-stone-300 leading-relaxed font-medium">
                This lesson challenges campers to rethink the idea of freedom. Culture teaches that freedom means doing whatever we want, but the Bible teaches that true freedom comes when Christ becomes the center of our lives. A follower of Christ understands that even their body, choices, and sacrifices exist for one purpose: that Christ would be exalted.
              </p>
            </section>
          </div>
        `, 
        poc: 'Pastor Jerald Sardiña',
        speaker: 'Pastor Jerald Sardiña',
        verse: 'Philippians 1:20',
        goal: 'Challenge campers to surrender their lives to Christ. Move them from admiration of Christ to real surrender.'
      },
      { 
        id: 'd1e12', 
        category: 'Circle', 
        start: '9:30 PM', 
        end: '10:00 PM', 
        title: 'EMPOWER CIRCLE 2 — Patay Kung Patay', 
        preview: 'Standing for Christ', 
        details: `
          <div class="space-y-4">
            <section class="bg-stone-900 text-white rounded-3xl overflow-hidden shadow-xl border border-white/10">
              <div class="p-6 border-b border-white/10 bg-white/5">
                <h4 class="text-xl font-black uppercase tracking-tight text-[#ff533d]">Patay Kung Patay — Read Me First</h4>
              </div>
              <div class="p-8 space-y-6">
                <div class="prose prose-invert max-w-none">
                  <h5 class="text-2xl font-black text-white uppercase italic mb-4">Cute ka ba?</h5>
                  <p class="text-stone-300 font-medium leading-relaxed">
                    Cute as in <span class="text-white font-black italic">Cristiano Umano (pero) Tumatakbo sa Engkwentro</span>. Yung sundalo ni Christ na pag kailangang panindigan yung pinaniniwalaan, nagiging jellyfish na walang backbone o asong bungal na puro tahol. Ang tapang-tapang pag sa kalokohan, patang-pata naman pagdating sa kabanalan. Kapika-pika kasi copy-copy lang sa galawan ng iba. Sunod sa agos. Walang kapake-pake kasi tingin lang sa Christianity meet and greet with friends sabay pakape-kape. Kung ang pananaw mo ng pagsunod kay Christ ay pasosyalan lang, umuwi ka na.
                  </p>
                  <p class="text-stone-300 font-medium leading-relaxed">
                    Hindi kailangan ni Christ ng mga tagasunod na pasawsaw-sawsaw lang. Commit ngayon omit bukas. Ningas ngayon, singaw bukas. Santo sa camp, kampon ni Satanas paglabas. Pwe!
                  </p>
                  <div class="p-6 bg-red-600/20 border border-red-500/30 rounded-2xl my-6 shadow-lg shadow-red-900/20">
                    <p class="text-white font-bold leading-relaxed">
                      Tandaang hindi cute ang Christianity. Hindi ito club ng mga influencer wannabees na nabubuhay para sa likes at approval ng mundo. Hindi ito tungkol sa <span class="bg-red-600 px-1">CUTIFIED life</span> kundi sa <span class="bg-white text-black px-1">CRUCIFIED living</span>. Hindi lang basta committed na mga tao ang hanap ni Christ kundi crucified disciples (Galatians 2:20)!
                    </p>
                  </div>
                  <p class="text-stone-300 font-medium leading-relaxed">
                    Hanapin mo sa Bible kung saan ka makakakita ng salitang “committed” o “volunteer” pagdating sa discipleship. Wala kang makikita! Bakit? Kasi ang language ng discipleship ay laging kamatayan — mamamatay ka sa sarili mong mga nasa at kaartehan sa buhay! Gyera ang pinasok natin hindi fashion show na puro pormahan. Sugod kung sugod. Patay kung patay. Kasi walang ibang rason ang existence natin sa mundo kundi si Christ.
                  </p>
                  
                  <div class="space-y-2 py-4 border-y border-white/5 my-6">
                    <p class="text-stone-300 font-medium tracking-tight italic">• Sa pag-aaral, si Christ.</p>
                    <p class="text-stone-300 font-medium tracking-tight italic">• Sa lahat ng relationships, si Christ.</p>
                    <p class="text-stone-300 font-medium tracking-tight italic">• Sa pagse-serve, pagta-trabaho, pagkilos, pagkain, pag-inom at ultimo sa simpleng paghinga, si Christ.</p>
                    <p class="text-stone-300 font-medium tracking-tight italic">• Mula ngayon hanggang wakas. Sa araw-araw, sa bawat desisyon, sa lahat ng ngiti at luha, tagumpay at pagkakadapa, si Christ, si Christ, at si Christ lang.</p>
                  </div>

                  <div class="mt-6 p-6 bg-white/5 rounded-2xl border border-white/5 relative">
                    <p class="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-3">The Motto & Battle Cry</p>
                    <p class="text-xl font-black text-white italic mb-4 leading-tight">“Hindi ‘my body, my choice’ ang motto kundi <span class="text-[#ff533d]">‘my body, His glory.’</span>”</p>
                    <p class="text-stone-300 text-sm font-medium leading-relaxed">
                      Sya lang ang Bida, hindi ka eepal at magpapaka-main character. Sabi nga ni Apostle Paul: 
                      <span class="text-white block mt-2 font-bold italic">“Sana… mabigyan ko ng honor si Christ sa buong buhay ko, buháy man ako o patay.” (Philippians 1:20, ABPV)</span>
                      Yan ang legit na battle cry!
                    </p>
                  </div>
                </div>

                <div class="pt-8 border-t border-white/10">
                  <h5 class="text-xs font-black text-stone-500 uppercase tracking-widest mb-4">Reflection Questions</h5>
                  <div class="grid gap-3">
                    <div class="p-4 bg-white/5 rounded-xl border border-white/5 text-sm font-bold text-stone-200">
                      • Na-experience mo na bang panindigan o ipaglaban ang isang tao, kosa o grupo? Kelan yun?
                    </div>
                    <div class="p-4 bg-white/5 rounded-xl border border-white/5 text-sm font-bold text-stone-200">
                      • Naging ganyan ka na rin ba ka-passionate pagdating kay Christ? Paano mo paninindigan si Christ paglabas ng camp?
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div class="p-8 bg-red-600 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <h4 class="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-4 block">Session Goal</h4>
              <ul class="space-y-2 text-white font-bold text-sm">
                <li>1. Help campers realize following Christ requires courage.</li>
                <li>2. Move from casual Christianity to crucified discipleship.</li>
                <li>3. Encourage standing for Christ outside the camp.</li>
              </ul>
            </div>

            <section class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div class="p-6 border-b border-stone-50 bg-stone-50/50">
                <h4 class="text-xl font-black text-stone-900 uppercase tracking-tight">Counselor Instructions</h4>
              </div>
              <div class="p-8 space-y-6">
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">1. Set the Tone (5 mins)</h5>
                  <p class="text-stone-700 font-medium italic">“Kanina narinig natin na ang Christianity ay hindi cute life, kundi crucified life. Hindi ito tungkol sa pagiging comfortable, kundi pagiging faithful kay Christ.”</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">2. Read Key Lines Together (5 mins)</h5>
                  <p class="text-sm text-stone-600 font-bold mb-2">“Hindi cute ang Christianity… crucified living ito.”</p>
                  <p class="text-sm text-stone-600 font-bold">“Gyera ang pinasok natin, hindi fashion show.”</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">3. Heart Check Discussion (15 mins)</h5>
                  <p class="text-sm text-stone-600 font-medium italic">Let the campers talk about where they stand spiritually. Encourage honesty over lectures.</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">4. Closing Challenge (5 mins)</h5>
                  <p class="text-sm text-stone-600 font-medium italic">“Kung seryoso tayo kay Christ, hindi pwedeng pang-camp lang ang faith natin.”</p>
                </div>
              </div>
            </section>

            <section class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div class="p-6 border-b border-stone-50 bg-stone-50/50">
                <h4 class="text-xl font-black text-stone-900 uppercase tracking-tight">Discussion Questions</h4>
                <p class="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 italic">Note: Choose 1-2 questions only that you see suitable for your group.</p>
              </div>
              <div class="p-8 space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="p-4 bg-stone-50 rounded-2xl">
                    <h5 class="font-black text-stone-400 uppercase text-[10px] mb-3">Grade School</h5>
                    <ul class="space-y-2 text-sm font-bold text-stone-700">
                      <li>1. Ano ang ibig sabihin ng pagiging matapang para kay Jesus?</li>
                      <li>2. May pagkakataon na ba na nahihiya kang sabihin na Christian ka?</li>
                      <li>3. Ano ang pwede mong gawin sa school para ipakita na mahal mo si Jesus?</li>
                    </ul>
                  </div>
                  <div class="p-4 bg-stone-50 rounded-2xl">
                    <h5 class="font-black text-stone-400 uppercase text-[10px] mb-3">High School</h5>
                    <ul class="space-y-2 text-sm font-bold text-stone-700">
                      <li>1. Na-experience mo na bang ipaglaban ang isang kaibigan o grupo?</li>
                      <li>2. Bakit minsan mas madaling maging matapang sa kalokohan kaysa sa faith?</li>
                      <li>3. Anong situation ang pwedeng mag-test kung tatayo ka para kay Christ?</li>
                      <li>4. Paano mo paninindigan si Christ pagbalik mo?</li>
                    </ul>
                  </div>
                  <div class="p-4 bg-stone-50 rounded-2xl">
                    <h5 class="font-black text-stone-400 uppercase text-[10px] mb-3">College</h5>
                    <ul class="space-y-2 text-sm font-bold text-stone-700">
                      <li>1. Difference ng committed Christian at crucified disciple?</li>
                      <li>2. Ano ang mga bagay na nagpapahina sa conviction mo?</li>
                      <li>3. Sa environment mo, saan ka pinaka-natitempt na mag-compromise?</li>
                      <li>4. Anong pagbabago ang dapat makita sa decisions mo?</li>
                    </ul>
                  </div>
                  <div class="p-4 bg-stone-50 rounded-2xl">
                    <h5 class="font-black text-stone-400 uppercase text-[10px] mb-3">Working</h5>
                    <ul class="space-y-2 text-sm font-bold text-stone-700">
                      <li>1. Kailan mo kinailangan manindigan kahit may pressure?</li>
                      <li>2. Situation sa trabaho/pamilya na pwedeng mag-test sa faith mo?</li>
                      <li>3. Paano mo mapapakita na si Christ ang sentro kahit sa ordinaryong araw?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        `, 
        poc: 'Pastor Joseph and Pastor Paul' 
      },
      { id: 'd1e13', category: 'Lights Off', start: '10:00 PM', end: '10:30 PM', title: 'Lights Off', preview: 'Rest for the next day.', details: 'Curfew for all campers to ensure adequate rest for Day 2 activities.', poc: 'Pastor Amoz and Jeem' }
    ]
  },
  {
    id: 'day2',
    label: 'Day 2',
    date: 'April 30',
    theme: 'APRIL 30 - 2nd DAY',
    events: [
      { id: 'd2e1', category: 'Warm-Up', start: '6:00 AM', end: '6:30 AM', title: 'Warm-Up / Energizers', preview: 'Morning energizers to start the day.', details: 'Physical activities and spiritual wake-up calls to prepare the body and mind for a demanding day.', poc: 'Pastor Amoz and Jeem' },
      { 
        id: 'd2e2', 
        category: 'Lesson', 
        start: '6:30 AM', 
        end: '7:00 AM', 
        title: 'Lesson 3 — Winning the Battle Within', 
        preview: 'Speaker: Pastor Joseph Ruetas', 
        details: `
          <div class="space-y-8">
            <div class="p-6 bg-red-600 text-white rounded-3xl transform -rotate-1 shadow-xl">
              <span class="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1">Theme Line</span>
              <p class="text-2xl font-black uppercase leading-none">Win the war inside before the battle outside.</p>
            </div>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">1. Strengthen Your Foundation (Love)</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                Paul begins with a prayer that love would abound more and more in knowledge and discernment. Biblical love is not just emotion—it is truth-guided love. When a believer is rooted in Christ and grounded in love, their decisions begin to reflect God's wisdom instead of impulse.
              </p>
              
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="text-[10px] font-black uppercase tracking-widest text-stone-400 w-full mb-1">Supporting Scriptures:</span>
                <button class="verse-btn" data-verse="Ephesians 3:17">Ephesians 3:17</button>
                <button class="verse-btn" data-verse="Colossians 2:6–7">Colossians 2:6–7</button>
                <button class="verse-btn" data-verse="1 John 4:7–8">1 John 4:7–8</button>
              </div>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold">Key Truth: A strong spiritual life begins with a heart rooted in Christ and grounded in love.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">2. Use Discernment as Your Weapon</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                Paul teaches believers to approve what is excellent. Life presents many options, but spiritual maturity means learning to choose what truly honors God. Discernment is developed through practice and becomes a powerful weapon in the spiritual battle.
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="text-[10px] font-black uppercase tracking-widest text-stone-400 w-full mb-1">Supporting Scriptures:</span>
                <button class="verse-btn" data-verse="Ephesians 6:17">Ephesians 6:17</button>
                <button class="verse-btn" data-verse="Hebrews 5:14">Hebrews 5:14</button>
              </div>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold">Key Truth: Discernment helps believers choose what is best, not just what is easy or acceptable.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">3. Live Pure and Blameless</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                Paul connects discernment with living a life that is sincere and blameless until the day of Christ. Winning the battle within means aligning thoughts, actions, and character with God’s will. True victory is not temporary success but faithful living over a lifetime.
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="text-[10px] font-black uppercase tracking-widest text-stone-400 w-full mb-1">Supporting Scriptures:</span>
                <button class="verse-btn" data-verse="Romans 12:1–2">Romans 12:1–2</button>
                <button class="verse-btn" data-verse="Ephesians 4:22–24">Ephesians 4:22–24</button>
                <button class="verse-btn" data-verse="Psalm 51:10">Psalm 51:10</button>
              </div>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold">Key Truth: Victory in the Christian life comes through daily surrender and a renewed heart.</div>
            </section>

            <section class="mt-12 p-8 bg-stone-900 rounded-[2rem] text-white">
              <h4 class="text-xs font-black uppercase tracking-[0.2em] text-[#ff533d] mb-4">Facilitator Summary</h4>
              <p class="text-stone-300 leading-relaxed font-medium">
                This lesson teaches that the greatest battle Christians face is the battle within the heart and mind. Paul prays that believers would grow in love, develop discernment, and live pure lives. When the inner life is aligned with Christ, believers are prepared to face the external challenges of life faithfully.
              </p>
            </section>
          </div>
        `, 
        poc: 'Pastor Joseph Ruetas',
        speaker: 'Pastor Joseph Ruetas',
        verse: 'Philippians 1:9–10',
        goal: 'Prepare their inner life for spiritual victory. Teach campers that the real battle starts in the heart and mind.'
      },
      { id: 'd2e3', category: 'Meal', start: '7:00 AM', end: '8:00 AM', title: 'Breakfast', preview: 'Breakfast break.', details: 'Commanders, gather your team and ensure everyone is complete and lined up in front of the canteen at least 5 minutes before breakfast. Please check your members before forming the line.', poc: 'ER' },
      { 
        id: 'd2e4', 
        category: 'Lesson', 
        start: '8:00 AM', 
        end: '9:00 AM', 
        title: 'Lesson 4 — Jesus Our Logos', 
        preview: 'Speaker: Pastor Amoz Mendoza', 
        details: `
          <div class="space-y-8">
            <div class="p-6 bg-red-600 text-white rounded-3xl transform rotate-1 shadow-xl">
              <span class="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1">Theme Line</span>
              <p class="text-2xl font-black uppercase leading-none">Christ is not part of your life — He is your life.</p>
            </div>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">1. Jesus Our Purpose</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                John 1:1 introduces Jesus as the <strong>Logos</strong> (Word). In Greek thought, logos means the reason or purpose behind something’s existence. Just as every object has a purpose, human life also has a purpose—and that purpose is found in Christ.
                <br /><br />
                If we live outside the purpose God designed for us, life eventually feels empty or misaligned.
              </p>
              
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="text-[10px] font-black uppercase tracking-widest text-stone-400 w-full mb-1">Supporting Scripture:</span>
                <button class="verse-btn" data-verse="John 1:1">John 1:1</button>
              </div>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold">Key Truth: Jesus is the reason our lives exist; true purpose is found in Him.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">2. Jesus Our Pattern</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                Jesus is not only our purpose—He is also our pattern for living. Loving Christ means following His commands and shaping our lives after His example. The Christian life is not just religious activity; it is a daily decision to choose Christ in every situation.
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="text-[10px] font-black uppercase tracking-widest text-stone-400 w-full mb-1">Supporting Scriptures:</span>
                <button class="verse-btn" data-verse="John 14:15">John 14:15</button>
                <button class="verse-btn" data-verse="Matthew 22:36–39">Matthew 22:36–39</button>
              </div>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold">Key Truth: Following Christ means intentionally choosing His way of life every day.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">3. Jesus Our Perfection</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                No one can meet God’s perfect standard on their own because all have sinned. But through Christ’s sacrifice, God offers redemption and forgiveness. Jesus fulfills the standard we could never reach and makes it possible for us to be restored to God.
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="text-[10px] font-black uppercase tracking-widest text-stone-400 w-full mb-1">Supporting Scripture:</span>
                <button class="verse-btn" data-verse="Romans 3:23–26">Romans 3:23–26</button>
              </div>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold">Key Truth: Jesus provides the righteousness and redemption we could never achieve on our own.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">4. Living and Dying for Christ</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                Paul declares, “To live is Christ, and to die is gain.” This means Christ becomes the center of life—our standard, our sacrifice, and our transformation.
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div class="p-4 bg-stone-100 rounded-2xl">
                  <div class="text-[10px] font-black uppercase text-red-500 mb-1">Standard</div>
                  <div class="text-sm font-bold">Living by Christ’s example, not our own preferences.</div>
                </div>
                <div class="p-4 bg-stone-100 rounded-2xl">
                  <div class="text-[10px] font-black uppercase text-red-500 mb-1">Sacrifice</div>
                  <div class="text-sm font-bold">Giving up what we want for God’s glory.</div>
                </div>
                <div class="p-4 bg-stone-100 rounded-2xl">
                  <div class="text-[10px] font-black uppercase text-red-500 mb-1">Sanctification</div>
                  <div class="text-sm font-bold">Allowing God to continually change our lives.</div>
                </div>
              </div>
              <p class="text-lg font-bold text-stone-800">To die for Christ means complete surrender, trusting that our lives are ultimately in God’s hands.</p>
              <div class="bg-red-50 p-4 rounded-xl mt-4 italic font-bold">Key Truth: When Christ becomes the center of life, every choice begins to reflect Him.</div>
            </section>

            <section class="mt-12 p-8 bg-stone-900 rounded-[2rem] text-white">
              <h4 class="text-xs font-black uppercase tracking-[0.2em] text-[#ff533d] mb-4">Facilitator Summary</h4>
              <p class="text-stone-300 leading-relaxed font-medium">
                This lesson teaches that Jesus is not just an addition to life—He is the very purpose of life. As the Logos, Christ reveals the reason we exist. When believers align their lives with Him, they find direction, transformation, and redemption. Living for Christ means surrendering every area of life so that He becomes the center of our identity and decisions.
              </p>
            </section>
          </div>
        `, 
        poc: 'Pastor Amoz Mendoza',
        speaker: 'Pastor Amoz Mendoza',
        verse: 'Philippians 1:21',
        goal: 'Help campers understand that Christ must be the center of their lives. Christianity is letting Christ define their life and purpose.'
      },
      { 
        id: 'd2e5', 
        category: 'Circle', 
        start: '9:00 AM', 
        end: '9:30 AM', 
        title: 'EMPOWER CIRCLE 3 — Walang Atrasan', 
        preview: 'Standing Strong for Christ', 
        details: `
          <div class="space-y-4">
            <section class="bg-stone-900 text-white rounded-3xl overflow-hidden shadow-xl border border-white/10">
              <div class="p-6 border-b border-white/10 bg-white/5">
                <h4 class="text-xl font-black uppercase tracking-tight text-[#ff533d]">Walang Atrasan — Read Me First</h4>
              </div>
              <div class="p-8 space-y-6">
                <div class="prose prose-invert max-w-none">
                  <h5 class="text-2xl font-black text-white uppercase italic mb-4">Payag ka ba na weak ang generation mo?</h5>
                  <p class="text-stone-300 font-medium leading-relaxed">
                    Mapagsabihan ng konti magtatampo. Minsang di masunod ang gusto hihinto. Iba-ibang bansag, iba-ibang kutsa, iba-ibang puna… tatanggapin mo na lang ba? Well kung hindi naman pala totoo, ipakita mo. Hindi ka snowflake, marupok, fragile, o soft. Wag na wag kang bibitaw sa pagkapit kay Christ… kagaya ni Apostle Paul.
                  </p>
                  <div class="p-6 bg-blue-600/20 border border-blue-500/30 rounded-2xl my-6">
                    <p class="text-white font-medium leading-relaxed italic">
                      Hindi nya sinulat ang love letter na ito para sa mga Philippians habang naka-check in sa hotel o AirbnB. Hindi ito parte ng kanyang spiritual time-out, me-time, o pastoral retreat. Nakakulong sya sa isang madilim at malamig na selda. Nakakadena ang mga paa, bantay-sarado ng mga sundalong gwardya. Di alam kung papalayain o papatayin, pero no retreat no-surrender pa rin ang battle cry nya. Bakit nya nga ba na-eexperience ang lahat ng ‘to? Kasi pinipreach nya si Christ.
                    </p>
                  </div>
                  <p class="text-stone-300 font-medium leading-relaxed italic border-l-4 border-red-600 pl-4">
                    Wala kang mababasang script na “Lord, napaka-unfair nyo naman!”, “Nagse-serve na nga sa inyo ganto pa nangyari!” o di kaya ay “Walang kwentang calling ‘to, sana di na ako sumunod.” Wala syang ibang sinabi kundi “(ayaw kong) mag-fail sa mga dapat kong gawin. Sana laging maging buo ang loob ko, lalo na ngayon, para mabigyan ko ng honor si Christ…” (Philippians 1:20)
                  </p>
                  <p class="text-stone-300 font-medium leading-relaxed mt-6">
                    <span class="text-white font-black italic">“Sana maging buo ang loob”?</span> Talaga lang? Nakakainis din minsan ‘tong si Apostle Paul e. Kaya nga sya nasa preso kasi buong-buo ang loob nya na i-preach si Christ tapos parang kulang pa sa kanya yun. Sa totoo lang, kung ikukumpara sa mga galawan natin ngayon… nakakapangliit. 
                  </p>
                  <p class="text-stone-300 font-medium leading-relaxed">
                    Kasi ngayon, takot na takot tayong ma-cancel, ma-bash, mapahiya, ma-reject, mag-fail, o ma-left out. Iyakin mindset kung baga. Gets naman yung mental health struggles na pwedeng madulot nung mga nabanggit na paraan ng “persecution” (huehue🤔), pero hindi kaya ito ang nagiging dakilang palusot ng mga sundalo ni Jesus ngayon? Tandaang hindi para sa mga cry babies ang gantong battle cry.
                  </p>
                  <div class="p-6 bg-white/5 border border-white/5 rounded-2xl my-6">
                    <p class="text-stone-200 font-bold leading-relaxed">
                      Kung ang goal ng buhay mo ay mabigyan ng honor si Christ, medal dapat ang mahirapan, masaktan, magsakripisyo, at maging uncomfortable para sa kanya. Kasi pag natutunan mong umabante para kay Christ, dun mo mararanasan ang kanyang biyaya sa harapan, habag sa likuran, katapatan sa tagiliran at pag-ibig sa bawat hakbang.
                    </p>
                  </div>
                </div>

                <div class="pt-8 border-t border-white/10">
                  <h5 class="text-xs font-black text-stone-500 uppercase tracking-widest mb-4">Reflection Questions</h5>
                  <div class="grid gap-3">
                    <div class="p-4 bg-white/5 rounded-xl border border-white/5 text-sm font-bold text-stone-200">
                      • Kelan ka huling nagreklamo kay Lord? Anong dahilan? Valid ba yung rant mo?
                    </div>
                    <div class="p-4 bg-white/5 rounded-xl border border-white/5 text-sm font-bold text-stone-200">
                      • Kelan mo huling naging prayer yung “Sana maging buo ang loob ko para mapasaya si Christ”? Kung never mo pang naging prayer yan, gawing mong panalangin ngayon.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div class="p-8 bg-stone-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <h4 class="text-xs font-black uppercase tracking-[0.3em] text-[#ff533d] mb-4 block">Session Goal</h4>
              <ul class="space-y-2 text-stone-300 font-bold text-sm">
                <li>1. Challenge campers to develop spiritual courage.</li>
                <li>2. Understand that faithfulness involves hardship and sacrifice.</li>
                <li>3. Choose a mindset of "No Retreat, No Surrender."</li>
              </ul>
            </div>

            <section class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div class="p-6 border-b border-stone-50 bg-stone-50/50">
                <h4 class="text-xl font-black text-stone-900 uppercase tracking-tight">Counselor Instructions</h4>
              </div>
              <div class="p-8 space-y-6">
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">1. Set the Tone (5 mins)</h5>
                  <p class="text-stone-700 font-medium italic">“Kanina sa lesson nakita natin na si Christ ang buhay natin. Pero ang tanong: kapag may pressure, mahirap, o may kumokontra… tatayo pa rin ba tayo?”</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">2. Highlight the Core Idea (5 mins)</h5>
                  <p class="text-sm text-stone-600 font-bold mb-2">Apostle Paul wrote Philippians while in prison.</p>
                  <p class="text-sm text-stone-600 font-medium italic">“Sana maging buo ang loob ko para mabigyan ko ng honor si Christ.”</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">3. Reflection Discussion (15 mins)</h5>
                  <p class="text-sm text-stone-600 font-medium italic">Allow campers to talk about struggles and fears in a safe space. No forced sharing.</p>
                </div>
              </div>
            </section>

            <section class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div class="p-6 border-b border-stone-50 bg-stone-50/50">
                <h4 class="text-xl font-black text-stone-900 uppercase tracking-tight">Discussion Questions</h4>
                <p class="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 italic">Note: Choose 1-2 questions only that you see suitable for your group.</p>
              </div>
              <div class="p-8 space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="p-4 bg-stone-50 rounded-2xl">
                    <h5 class="font-black text-stone-400 uppercase text-[10px] mb-3">Grade School</h5>
                    <ul class="space-y-2 text-sm font-bold text-stone-700">
                      <li>1. Ano ang ibig sabihin ng hindi sumusuko kay Jesus?</li>
                      <li>2. Nahihirapan ka bang gawin ang tama? Ano nangyari?</li>
                      <li>3. Paano mo ipapakita na mahal mo si Jesus kahit mahirap?</li>
                    </ul>
                  </div>
                  <div class="p-4 bg-stone-50 rounded-2xl">
                    <h5 class="font-black text-stone-400 uppercase text-[10px] mb-3">High School</h5>
                    <ul class="space-y-2 text-sm font-bold text-stone-700">
                      <li>1. Kailan ka huling natakot manindigan sa faith mo?</li>
                      <li>2. Bakit maraming Christian ang nahihiya sa faith nila?</li>
                      <li>3. Meaning ng “walang atrasan” sa faith mo?</li>
                    </ul>
                  </div>
                  <div class="p-4 bg-stone-50 rounded-2xl">
                    <h5 class="font-black text-stone-400 uppercase text-[10px] mb-3">College</h5>
                    <ul class="space-y-2 text-sm font-bold text-stone-700">
                      <li>1. Emotional faith vs Enduring faith?</li>
                      <li>2. Trial o excuse lang para umatras?</li>
                      <li>3. Anong bagay sa buhay mo ang kailangan mong baguhin?</li>
                    </ul>
                  </div>
                  <div class="p-4 bg-stone-50 rounded-2xl">
                    <h5 class="font-black text-stone-400 uppercase text-[10px] mb-3">Working</h5>
                    <ul class="space-y-2 text-sm font-bold text-stone-700">
                      <li>1. Mahirap bang maging faithful kay Christ?</li>
                      <li>2. Pressure sa trabaho/pamilya na nagttest sa faith mo?</li>
                      <li>3. Practical step para manatiling faithful araw-araw?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        `, 
        poc: 'Pastor Joseph and Pastor Paul' 
      },
      { id: 'd2e6', category: 'Briefing', start: '9:30 AM', end: '10:00 AM', title: 'The Great 8 Explanation', preview: 'Instructions for the challenge.', details: 'Detailed instructions and safety rules for the main outdoor team competition.', poc: 'Beth' },
      { id: 'd2e7', category: 'Challenge', start: '10:00 AM', end: '11:30 AM', title: 'The Great 8 Challenges', preview: 'Outdoor team challenges.', details: 'A circuit of 8 demanding tasks that test strength, ingenuity, and teamwork. The heart of the Battle Royale.', poc: 'Beth' },
      { id: 'd2e16', category: 'Clean-up', start: '11:30 AM', end: '12:00 PM', title: 'Clean up Time', preview: 'Preparing for Lunch.', details: 'Freshen up and clean up after the intense outdoor challenges to prepare for lunch.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd2e8', category: 'Meal', start: '12:00 PM', end: '1:00 PM', title: 'Lunch', preview: 'Lunch break.', details: 'Commanders, ensure your team is complete and properly lined up in front of the canteen at least 5 minutes before lunchtime. Please verify that all members are present.', poc: 'ER' },
      { id: 'd2e9', category: 'Team', start: '1:30 PM', end: '3:30 PM', title: 'Team Huddle', preview: 'Talent presentation prep.', details: 'Final preparation and rehearsal for the talent night presentations.', poc: 'Beth' },
      { id: 'd2e10', category: 'Games', start: '3:30 PM', end: '4:30 PM', title: 'Battle Plan', preview: 'Mini-games session.', details: 'Targeted competitive games to rack up additional points for the leaderboard.', poc: 'Beth' },
      { id: 'd2e11', category: 'Battle Royale', start: '4:30 PM', end: '5:30 PM', title: 'The Battle Royale', preview: 'The Last Battle.', details: 'The grand finale of the physical competitions. All teams converge for a final high-stakes showdown.', poc: 'Beth' },
      { 
        id: 'd2e17', 
        category: 'Circle', 
        start: '5:30 PM', 
        end: '6:00 PM', 
        title: 'EMPOWER CIRCLE 4 — The Real Battle', 
        preview: 'Post-Battle Reflection', 
        details: `
          <div class="space-y-4">
            <div class="p-8 bg-stone-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden text-center">
              <h4 class="text-xs font-black uppercase tracking-[0.3em] text-[#ff533d] mb-4 block">Session Goal</h4>
              <p class="text-lg font-bold leading-tight">
                Slow down after the games. Share feelings and realize that the <span class="text-[#ff533d]">real battle</span> is daily life after camp.
              </p>
            </div>

            <section class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div class="p-6 border-b border-stone-50 bg-stone-50/50">
                <h4 class="text-xl font-black text-stone-900 uppercase tracking-tight">Counselor Instructions</h4>
              </div>
              <div class="p-8 space-y-6">
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">1. Start with Kamustahan (10 mins)</h5>
                  <p class="text-stone-700 font-medium italic">“Pagod na ba kayo? Mukhang intense yung Battle Royal ah.”</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">2. Transition to the Lesson (5 mins)</h5>
                  <p class="text-sm text-stone-600 font-medium italic">“Kanina sa games, may battle tayo. Strategy, teamwork, pagod. Pero ang totoo, hindi yung games ang tunay na battle.”</p>
                  <p class="text-xs font-bold text-red-500 mt-2">Proceed to share the "Real Battle" lesson below.</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">3. Reflection Conversation (10–12 mins)</h5>
                  <p class="text-sm text-stone-600 font-medium italic">Let the campers talk about what they experienced. Focus on feelings and realizations.</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">4. Personal Connection (3–5 mins)</h5>
                  <p class="text-sm text-stone-900 font-bold italic">“After everything you experienced this camp… ano ang pinaka tumatak sa’yo?”</p>
                </div>
              </div>
            </section>

            <section class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div class="p-6 border-b border-stone-50 bg-stone-50/50">
                <h4 class="text-xl font-black text-stone-900 uppercase tracking-tight">5-Minute Lesson: The Real Battle</h4>
              </div>
              <div class="p-8 space-y-6">
                <div class="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <h5 class="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Key Verse</h5>
                  <button class="verse-btn mb-2" data-verse="1 Timothy 6:12">1 Timothy 6:12</button>
                  <p class="text-sm text-stone-600 italic">"Fight the good fight of faith, lay hold on eternal life, whereunto thou art also called."</p>
                </div>

                <div class="space-y-4">
                  <p class="text-stone-700 font-medium leading-relaxed">
                    The games end today. But the <span class="bg-red-600 text-white px-2 py-0.5 rounded">real battle</span> begins when you go home.
                  </p>
                  
                  <div class="space-y-2">
                    <p class="text-stone-900 font-bold">The real battle is about faith:</p>
                    <ul class="space-y-2 text-sm text-stone-600 ml-4 font-bold">
                      <li class="flex items-start gap-2">• Standing for Christ when nobody else is standing.</li>
                      <li class="flex items-start gap-2">• Choosing what is right even when it is hard.</li>
                      <li class="flex items-start gap-2">• Facing pressure from friends who want you to compromise.</li>
                    </ul>
                  </div>

                  <div class="p-4 bg-red-50 rounded-xl">
                    <p class="text-stone-800 font-bold text-sm">The Christian life is a <span class="text-red-600">daily battle</span> against Temptation, Pressure, Fear, and Sin.</p>
                  </div>

                  <div class="pt-4 border-t border-stone-100">
                    <p class="text-xs font-black text-stone-400 uppercase tracking-widest mb-2">Core Truth</p>
                    <p class="text-stone-900 font-black uppercase text-xl leading-none">The battle at camp was just a game. The battle for your faith is real.</p>
                  </div>
                </div>
              </div>
            </section>

            <section class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div class="p-6 border-b border-stone-50 bg-stone-50/50">
                <h4 class="text-xl font-black text-stone-900 uppercase tracking-tight">Discussion Questions</h4>
                <p class="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 italic">Note: Choose 1-2 questions only that you see suitable for your group.</p>
              </div>
              <div class="p-8 space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="p-4 bg-stone-50 rounded-2xl">
                    <h5 class="font-black text-stone-400 uppercase text-[10px] mb-3">Grade School</h5>
                    <ul class="space-y-2 text-sm font-bold text-stone-700">
                      <li>1. Ano yung pinaka nagustuhan mo sa camp?</li>
                      <li>2. Pinaka masayang moment sa games?</li>
                      <li>3. Ano yung natutunan mo tungkol kay Jesus?</li>
                    </ul>
                  </div>
                  <div class="p-4 bg-stone-50 rounded-2xl">
                    <h5 class="font-black text-stone-400 uppercase text-[10px] mb-3">High School</h5>
                    <ul class="space-y-2 text-sm font-bold text-stone-700">
                      <li>1. Pinaka challenging moment sa Battle Royal?</li>
                      <li>2. Natutunan tungkol sa teamwork o perseverance?</li>
                      <li>3. Ano yung “real battle” pagbalik sa school?</li>
                    </ul>
                  </div>
                  <div class="p-4 bg-stone-50 rounded-2xl">
                    <h5 class="font-black text-stone-400 uppercase text-[10px] mb-3">College</h5>
                    <ul class="space-y-2 text-sm font-bold text-stone-700">
                      <li>1. Pinaka tumatak sa’yo sa buong camp experience?</li>
                      <li>2. Paano naka-connect games sa spiritual battle?</li>
                      <li>3. Anong area ng buhay kailangan mong paghandaan?</li>
                    </ul>
                  </div>
                  <div class="p-4 bg-stone-50 rounded-2xl">
                    <h5 class="font-black text-stone-400 uppercase text-[10px] mb-3">Working</h5>
                    <ul class="space-y-2 text-sm font-bold text-stone-700">
                      <li>1. Pinaka meaningful na experience mo sa camp?</li>
                      <li>2. Lesson na dadalhin mo pagbalik sa normal life?</li>
                      <li>3. Paano mo maipapakita ang faith mo?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section class="p-8 bg-red-600 text-white rounded-[2.5rem] shadow-xl">
              <p class="text-[#fca5a5] font-black uppercase text-xs mb-2 tracking-widest">Core Truth</p>
              <p class="text-2xl font-black uppercase italic leading-tight mb-4">“The battle at camp was just a game. But the battle for your faith is real.”</p>
              <p class="text-sm font-bold text-red-100 mb-6">Every day you will have to decide: Will you stand for Christ… or blend in with the world?</p>
              
              <div class="mt-6 pt-6 border-t border-red-500/30">
                <h5 class="text-[10px] font-black text-red-100 uppercase tracking-widest mb-2">Closing Line</h5>
                <p class="text-xl font-black uppercase text-white italic">“The games may be over… but the real battle for your faith starts the moment you go home.”</p>
              </div>
            </section>
          </div>
        `, 
        poc: 'Pastor Joseph and Pastor Paul' 
      },
      { id: 'd2e18', category: 'Meal', start: '6:00 PM', end: '7:10 PM', title: 'Dinner', preview: 'Dinner break.', details: 'Commanders, make sure your team is complete and properly lined up in front of the canteen at least 5 minutes before dinner time. Kindly check your members before forming the line.', poc: 'ER' },
      { id: 'd2e12', category: 'Presentation', start: '7:15 PM', end: '8:30 PM', title: 'Team Presentation', preview: 'Sprints, songs, or performances.', details: 'Creative expressions of faith and the camp theme. Maximum 5 minutes per team. Judged for creativity and message.', poc: 'Beth' },
      { 
        id: 'd2e13', 
        category: 'Lesson', 
        start: '8:30 PM', 
        end: '9:30 PM', 
        title: 'Lesson 5 — Walking Worthy in the Battle', 
        preview: 'Speaker: Ptr. Neth Isip', 
        details: `
          <div class="space-y-8">
            <div class="p-8 bg-stone-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff533d] mb-4 block">Theme: Christ-Consumed Living</span>
              <h4 class="text-4xl font-black uppercase tracking-tight leading-none mb-6">How should a warrior live?</h4>
              <div class="space-y-2">
                <p class="text-xl font-bold flex items-center gap-3"><span class="w-2 h-2 bg-[#ff533d] rounded-full"></span> Not casual.</p>
                <p class="text-xl font-bold flex items-center gap-3"><span class="w-2 h-2 bg-[#ff533d] rounded-full"></span> Not convenient.</p>
                <p class="text-xl font-bold flex items-center gap-3"><span class="w-2 h-2 bg-[#ff533d] rounded-full"></span> Not comfortable.</p>
                <p class="text-3xl font-black text-[#ff533d] uppercase mt-4">A warrior lives Christ-Consumed.</p>
              </div>
            </div>

            <div class="flex items-center gap-3 text-stone-400 uppercase tracking-[0.2em] text-[10px] font-black">
              <div class="h-px flex-1 bg-stone-100"></div>
              Main Battle Commands
              <div class="h-px flex-1 bg-stone-100"></div>
            </div>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">1. SURRENDER — Die to Self</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                Before a warrior fights, he must first surrender to the King. Jesus calls His followers to deny themselves and take up their cross. A life devoted to Christ begins with surrender—laying down personal control, pride, and sin to follow Him fully.
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <button class="verse-btn" data-verse="Luke 9:23">Luke 9:23</button>
              </div>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold text-red-700">Key Truth: Victory in the Christian life begins with total surrender to Christ.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">2. STAND — Hold the Line</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                Paul calls believers to stand firm in one spirit. Christians are citizens of Heaven living in the world, representing Christ wherever they go. Just as Roman colonies reflected Rome, believers are called to reflect the kingdom of God in their everyday lives.
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <button class="verse-btn" data-verse="Philippians 1:27">Philippians 1:27</button>
              </div>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold text-red-700">Key Truth: Christ-followers must stand firm and represent Christ wherever they are placed.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">3. STRIVE — Fight as One</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                The Christian life is not meant to be lived alone. Paul urges believers to strive together for the faith, standing side by side like soldiers in formation. Unity, accountability, and shared faith strengthen believers to endure the battles of life.
              </p>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold text-red-700">Key Truth: Spiritual battles are fought best when believers stand together in unity.</div>
            </section>

            <section class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="p-8 bg-stone-50 rounded-[2rem] border border-stone-100">
                <h5 class="text-xs font-black uppercase tracking-widest text-stone-400 mb-4">Core Idea</h5>
                <ul class="space-y-3 text-stone-800 font-bold">
                  <li class="flex items-start gap-2 text-sm"><span class="text-[#ff533d]">01</span> Surrender to the King.</li>
                  <li class="flex items-start gap-2 text-sm"><span class="text-[#ff533d]">02</span> Stand firm in the faith.</li>
                  <li class="flex items-start gap-2 text-sm"><span class="text-[#ff533d]">03</span> Strive together with God’s people.</li>
                </ul>
              </div>
              <div class="p-8 bg-stone-50 rounded-[2rem] border border-stone-100">
                <h5 class="text-xs font-black uppercase tracking-widest text-[#ff533d] mb-4">Key Takeaway</h5>
                <p class="text-sm font-bold text-stone-800 leading-relaxed">
                  The Christian life is not passive or comfortable. A true follower of Christ lives fully surrendered, firmly grounded, and faithfully united with others in the battle for the Gospel.
                </p>
              </div>
            </section>
          </div>
        `, 
        poc: 'Ptr. Neth Isip',
        speaker: 'Ptr. Neth Isip',
        verse: 'Philippians 1:27',
        goal: 'Call campers to live a life worthy of the Gospel. Challenge them to stand firm in faith and live as citizens of Heaven.'
      },
      { id: 'd2e14', category: 'Campfire', start: '9:30 PM', end: '11:00 PM', title: 'Campfire', preview: 'What Are You Burning?', details: 'Facilitators: Ton / Theo / Lester / Venzen. Theme: What Are You Burning Tonight? A symbolic act of surrendering burdens.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd2e15', category: 'Lights Off', start: '11:00 PM', end: '11:30 PM', title: 'Lights Off', preview: 'Final night rest.', details: 'Rest for the concluding day of the camp.', poc: 'Pastor Amoz and Jeem' }
    ]
  },
  {
    id: 'day3',
    label: 'Day 3',
    date: 'May 1',
    theme: 'MAY 1 - Lastday',
    events: [
      { 
        id: 'd3e1', 
        category: 'Lesson', 
        start: '6:00 AM', 
        end: '6:15 AM', 
        title: 'Lesson 6 — Standing Firm in the Battle', 
        preview: 'Speaker: Pastor Philip Dumlao', 
        details: `
          <div class="space-y-8">
            <div class="p-6 bg-[#ff533d] text-white rounded-3xl transform -rotate-1 shadow-xl">
              <span class="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1">Theme Line</span>
              <p class="text-2xl font-black uppercase leading-none">Stand firm when the pressure hits.</p>
            </div>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">Main Idea</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed">
                After surrendering to Christ, the next challenge is standing firm when pressure comes. Faith is not tested only in emotional moments like the bonfire night—it is tested in everyday situations where believers must choose to remain faithful to Christ.
              </p>
              <div class="mt-4">
                <button class="verse-btn" data-verse="Philippians 1:27–28">Philippians 1:27–28</button>
              </div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">1. Standing Firm is Active, Not Passive</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                Paul says believers must be “striving side by side.” The word describes athletes competing together. Standing firm is not simply avoiding failure—it is actively living out faith and encouraging others to do the same.
              </p>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold text-red-700">Key Truth: Standing firm means actively pursuing faith and encouraging others in the battle.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">2. Fear is the Enemy’s Tool</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                Paul tells believers not to be frightened by opponents. Fear is one of the enemy’s strongest weapons. When believers allow fear to control them, it weakens their ability to stand firm for Christ.
                <br /><br />
                Standing firm requires recognizing fear and choosing to trust God instead.
              </p>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold text-red-700">Key Truth: Faith grows when believers refuse to let fear control their decisions.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">3. You Do Not Stand Alone</h4>
              <p class="text-lg text-stone-700 font-medium leading-relaxed mb-4">
                Paul emphasizes “one spirit, one mind.” The Christian life is not meant to be fought alone. Just like soldiers in formation, believers gain strength when they support and stand beside one another.
              </p>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold text-red-700">Key Truth: Believers stand firm when they walk in unity and support one another.</div>
            </section>

            <section class="mt-12 p-8 bg-stone-900 rounded-[2rem] text-white">
              <h4 class="text-xs font-black uppercase tracking-[0.2em] text-[#ff533d] mb-4">Facilitator Summary</h4>
              <p class="text-stone-300 leading-relaxed font-medium">
                This devotion reminds campers that faith will be tested once they leave the emotional moments of camp. Standing firm requires intentional effort, courage in the face of fear, and strong relationships with fellow believers. When Christians stand together and trust God, they can remain steady even when pressure comes.
              </p>
            </section>
          </div>
        `, 
        poc: 'Pastor Philip Dumlao',
        speaker: 'Pastor Philip Dumlao',
        verse: 'Philippians 1:27–28',
        goal: 'Encourage them to stand firm in faith and support one another. The focus is staying faithful even when challenges come.'
      },
      { id: 'd3e8', category: 'Devotion', start: '6:30 AM', end: '7:00 AM', title: 'Personal Devotion Time / Quiet Time', preview: 'Personal prayer and reflection.', details: 'A dedicated time for individual prayer, Bible reading, and spiritual reflection to start the final day of camp.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd3e2', category: 'Meal', start: '7:00 AM', end: '8:00 AM', title: 'Breakfast', preview: 'Last camp breakfast.', details: 'Commanders, ensure your team is complete and lined up in front of the canteen at least 5 minutes before breakfast time. Please confirm that all members are present.', poc: 'ER' },
      { id: 'd3e3', category: 'Pack-Up', start: '8:00 AM', end: '9:00 AM', title: 'Pack-Up & Cleanup', preview: 'Balik Phone.', details: 'Clearing rooms and returning camp equipment. Mobile phones are returned to campers.', poc: 'Pastor Amoz and Jeem' },
      { 
        id: 'd3e4', 
        category: 'Lesson', 
        start: '9:00 AM', 
        end: '10:00 AM', 
        title: 'Lesson 7 — Battle Cry: “What About You?”', 
        preview: 'Speaker: Ptr. Yusef Doca', 
        details: `
          <div class="space-y-8">
            <div class="p-8 bg-stone-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div class="absolute -right-10 -bottom-10 opacity-5">
                <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M11 15h2m-2-3h2m-2-3h2m-2-3h2m-9 12h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
              <h4 class="text-xs font-black uppercase tracking-[0.3em] text-[#ff533d] mb-4 block">Main Idea</h4>
              <p class="text-2xl font-black uppercase leading-tight mb-4">
                It’s not about your situation — it’s about your response.
              </p>
              <div class="space-y-1 text-stone-400 font-bold italic">
                <p>Paul made his chains count.</p>
                <p>The question is: <span class="text-white not-italic underline decoration-[#ff533d] decoration-4">Will you?</span></p>
              </div>
            </div>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase text-balance">1. WHAT ARE YOU CHAINED TO? – (“my bonds…”)</h4>
              <p class="text-lg text-stone-700 font-medium mb-4">Paul had chains, but his chains had purpose. Some chains are visible, but many are hidden inside the heart.</p>
              <div class="bg-stone-50 border border-stone-100 p-6 rounded-3xl mb-4">
                <p class="text-xs font-black uppercase tracking-widest text-[#ff533d] mb-4">Questions to confront:</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-bold text-stone-800">
                  <div class="flex items-center gap-2">• Secret sin?</div>
                  <div class="flex items-center gap-2">• Addiction?</div>
                  <div class="flex items-center gap-2">• Wrong relationship?</div>
                  <div class="flex items-center gap-2">• Fear of people?</div>
                </div>
              </div>
              <p class="text-lg text-stone-700 font-medium italic mb-4">Hindi lahat ng chains ay visible, but they are very real.</p>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold text-red-700">Key Truth: Hidden chains can silently control a life that outwardly looks free.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">2. WHO ARE YOU LIVING FOR? – (“in Christ…”)</h4>
              <p class="text-lg text-stone-700 font-medium mb-6">Paul’s life was clearly centered on Christ. His identity, purpose, and decisions all flowed from that relationship.</p>
              <p class="text-stone-400 font-black uppercase tracking-widest text-[10px] mb-2 leading-none">Sino talaga ang sinusunod mo?</p>
              <div class="flex flex-wrap gap-2 mb-6">
                <span class="px-4 py-2 bg-stone-100 rounded-full text-xs font-black uppercase">Sarili?</span>
                <span class="px-4 py-2 bg-stone-100 rounded-full text-xs font-black uppercase">Barkada?</span>
                <span class="px-4 py-2 bg-stone-100 rounded-full text-xs font-black uppercase">Social Media?</span>
                <span class="px-4 py-2 bg-red-600 text-white rounded-full text-xs font-black uppercase">Jesus Christ?</span>
              </div>
              <p class="text-stone-700 font-medium italic">Kasi kahit sabihin mong Christian ka… <span class="font-black not-italic text-stone-900 uppercase tracking-tight">your lifestyle reveals your true leader.</span></p>
              <div class="bg-red-50 p-4 rounded-xl mt-6 italic font-bold text-red-700">Key Truth: Your real leader is revealed not by your words, but by your lifestyle.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">3. WHAT MESSAGE IS YOUR LIFE SHOWING? – (“are manifest…”)</h4>
              <p class="text-lg text-stone-700 font-medium mb-4">Paul’s chains made Christ visible to others. His life clearly pointed people toward Jesus.</p>
              <div class="p-4 rounded-2xl border-2 border-dashed border-stone-200 mb-6">
                <p class="text-xs font-black uppercase tracking-[0.2em] text-stone-400 mb-2">Definition</p>
                <p class="text-lg font-bold text-stone-800"><span class="text-[#ff533d]">Manifest</span> means visible, obvious, undeniable.</p>
              </div>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold text-red-700">Key Truth: Your life is already preaching a message — the question is what it is saying.</div>
            </section>

            <section>
              <h4 class="text-2xl font-black text-stone-900 border-l-4 border-red-500 pl-4 mb-4 uppercase">4. WHERE IS YOUR IMPACT?</h4>
              <p class="text-lg text-stone-700 font-medium italic mb-6 leading-relaxed">
                Even while in chains, Paul influenced people everywhere around him.
                <span class="block mt-4 not-italic font-bold text-stone-800">
                  • Sa school mo, may impact ka ba?<br />
                  • Sa pamilya mo, may pagbabago ba?<br />
                  • Sa barkada mo, may liwanag ka ba?
                </span>
              </p>
              <p class="text-2xl font-black text-[#ff533d] uppercase tracking-tighter mb-6">Or are you just blending in?</p>
              <div class="bg-red-50 p-4 rounded-xl italic font-bold text-red-700">Key Truth: Real faith cannot stay hidden — it always creates influence somewhere.</div>
            </section>

            <div class="p-8 bg-red-600 text-white rounded-[2.5rem] shadow-2xl">
              <span class="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2 block">Core Line</span>
              <p class="text-3xl font-black uppercase tracking-tight leading-none italic italic">
                “Hindi mo kontrolado ang tanikala mo… pero kontrolado mo kung paano ka lalaban.”
              </p>
            </div>

            <section>
              <button class="verse-btn mb-4" data-verse="Philippians 1:13">Read Philippians 1:13 (NKJV)</button>
              <div class="p-8 bg-stone-50 rounded-[2rem] border border-stone-100">
                <h5 class="text-xs font-black uppercase tracking-widest text-stone-400 mb-4">Session Goal</h5>
                <p class="text-sm font-bold text-stone-800 leading-relaxed">
                  Lead campers to examine their lives honestly: what is controlling them, who they are truly following, what message their lives communicate, and where their faith is making an impact. Move from passive belief to a life that visibly reflects Christ.
                </p>
              </div>
            </section>
          </div>
        `, 
        poc: 'Ptr. Yusef Doca',
        speaker: 'Ptr. Yusef Doca',
        verse: 'Philippians 1:13',
        goal: 'Challenge campers to live boldly for Christ in everyday life.'
      },
      { id: 'd3e5', category: 'Q&A', start: '10:00 AM', end: '11:30 AM', title: 'Q&A Session', preview: 'Open floor discussion.', details: 'An interactive session addressing campers\' questions and providing clarity on the lessons learned.', poc: 'Pastor Amoz and Jeem' },
      { 
        id: 'd3e9', 
        category: 'Circle', 
        start: '11:30 AM', 
        end: '12:00 PM', 
        title: 'EMPOWER CIRCLE 5 — Carry the Battle', 
        preview: 'Feedback & Connection', 
        details: `
          <div class="space-y-4">
            <div class="p-8 bg-stone-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <h4 class="text-xs font-black uppercase tracking-[0.3em] text-[#ff533d] mb-4 block">Session Goal</h4>
              <ul class="space-y-2 text-stone-300 font-bold text-sm">
                <li>1. Reflect on the camp experience.</li>
                <li>2. Gather honest feedback about sessions and activities.</li>
                <li>3. Safe moment for final questions about faith.</li>
                <li>4. Build lasting connections beyond the camp.</li>
              </ul>
            </div>

            <section class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div class="p-6 border-b border-stone-50 bg-stone-50/50">
                <h4 class="text-xl font-black text-stone-900 uppercase tracking-tight">Counselor Instructions</h4>
              </div>
              <div class="p-8 space-y-6">
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">1. Start with Gratitude (3–5 mins)</h5>
                  <p class="text-stone-700 font-medium italic">“Natapos na natin ang camp, pero hindi dito nagtatapos ang journey natin. Gusto lang naming marinig kung ano ang experience ninyo sa camp.”</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">2. Feedback Form Guide (10–12 mins)</h5>
                  <p class="text-sm text-stone-600 font-medium mb-3">Guide them through favorite parts, favorite speaker/lesson, and remaining questions.</p>
                  <p class="text-xs font-bold text-stone-900 italic">“Kung may tanong kayo tungkol sa lesson, faith, or kahit ano sa camp, ito yung chance ninyo para ilagay.”</p>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">3. Short Sharing Moment (5–8 mins)</h5>
                  <ul class="space-y-1 text-sm text-stone-700 font-bold">
                    <li>• Ano yung pinaka tumatak sa’yo?</li>
                    <li>• Ano yung lesson na hindi mo makakalimutan?</li>
                  </ul>
                </div>
                <div>
                  <h5 class="font-black text-red-600 uppercase text-xs mb-2">4. Connection Time (5–7 mins)</h5>
                  <p class="text-stone-700 font-medium italic mb-2">“Hindi natatapos ang relationship natin sa camp. Kung gusto ninyo, pwede tayong mag-connect...”</p>
                  <p class="text-xs text-stone-50">Counselors: Share contact numbers or connect through group chats.</p>
                </div>
              </div>
            </section>

            <section class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div class="p-6 border-b border-stone-50 bg-stone-50/50">
                <h4 class="text-xl font-black text-stone-900 uppercase tracking-tight">Reflection Questions</h4>
                <p class="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 italic">Note: Choose 1-2 questions only that you see suitable for your group.</p>
              </div>
              <div class="p-8 space-y-3">
                <ul class="space-y-3 text-sm font-bold text-stone-700">
                  <li class="flex items-start gap-2 p-3 bg-stone-50 rounded-xl">• Ano ang pinaka favorite mong part ng camp?</li>
                  <li class="flex items-start gap-2 p-3 bg-stone-50 rounded-xl">• Anong lesson ang pinaka tumatak sa’yo?</li>
                  <li class="flex items-start gap-2 p-3 bg-stone-50 rounded-xl">• May tanong ka pa ba tungkol sa faith o sa mga lesson?</li>
                  <li class="flex items-start gap-2 p-3 bg-stone-50 rounded-xl">• Ano ang isang bagay na gusto mong baguhin pagkatapos ng camp?</li>
                </ul>
              </div>
            </section>
            <section class="p-8 bg-red-600 text-white rounded-[2.5rem] shadow-xl">
              <p class="text-[#fca5a5] font-black uppercase text-xs mb-2 tracking-widest">Key Truth</p>
              <p class="text-2xl font-black uppercase italic leading-tight mb-4">“Camp may end, but the journey of following Christ continues beyond these three days.”</p>
              
              <div class="mt-6 pt-6 border-t border-red-500/30">
                <h5 class="text-[10px] font-black text-red-100 uppercase tracking-widest mb-2">Final Reminder</h5>
                <p class="text-sm font-medium text-red-50 italic">“The goal is that campers leave knowing: They are not walking the battle alone.”</p>
              </div>
            </section>
          </div>
        `, 
        poc: 'Pastor Joseph and Pastor Paul' 
      },
      { id: 'd3e10', category: 'Meal', start: '12:00 PM', end: '1:00 PM', title: 'Lunch', preview: 'Final camp lunch.', details: 'Commanders, make sure your team is complete and properly lined up in front of the canteen at least 5 minutes before lunchtime. Please check that all members are present before lining up.', poc: 'ER' },
      { id: 'd3e7', category: 'Awards', start: '1:05 PM', end: '1:30 PM', title: 'Awards Ceremony', preview: 'Recognition and farewell.', details: 'Awarding the Battle Royale champions and special individual citations. Final group photos.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd3e11', category: 'Checkout', start: '1:30 PM', end: '2:30 PM', title: 'Getting Ready to Go Home', preview: 'Final preparations.', details: 'Final room checks, gathering belongings, and saying goodbyes.', poc: 'Pastor Amoz and Jeem' }
    ]
  }
];


// Utility to sort events by time
const timeToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(/\s+/);
  if (parts.length < 2) return 0;
  const [time, period] = parts;
  let [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours)) hours = 0;
  if (isNaN(minutes)) minutes = 0;
  if (period?.toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (period?.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export default function App() {
  const [data] = useState<Day[]>(INITIAL_DATA);
  const [activeDayId, setActiveDayId] = useState(INITIAL_DATA[0].id);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventDayId, setSelectedEventDayId] = useState<string | null>(null);
  const [activeVerse, setActiveVerse] = useState<{ref: string, text: string} | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'>('xl');
  const [filter, setFilter] = useState<'ALL' | 'LESSON' | 'CIRCLE'>('ALL');

  // Background Scroll Effect
  const { scrollY } = useScroll();
  const spartanOpacity = 0.15; // Steady opacity
  
  useEffect(() => {
    const root = document.documentElement;
    const sizes = {
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px'
    };
    root.style.fontSize = sizes[fontSize];
  }, [fontSize]);

  const activeDay = data.find(d => d.id === activeDayId) || data[0];
  const selectedEvent = selectedEventId && selectedEventDayId 
    ? data.find(d => d.id === selectedEventDayId)?.events.find(e => e.id === selectedEventId)
    : null;

  const textSizeClass = {
    sm: 'text-xs sm:text-sm',
    base: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-lg sm:text-xl',
    '2xl': 'text-xl sm:text-2xl',
    '3xl': 'text-2xl sm:text-3xl'
  }[fontSize];

  const headingSizeClass = {
    sm: 'text-lg sm:text-xl',
    base: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl md:text-5xl lg:text-7xl',
    '2xl': 'text-4xl sm:text-5xl md:text-7xl lg:text-8xl',
    '3xl': 'text-5xl sm:text-7xl md:text-8xl lg:text-9xl'
  }[fontSize];

  const getCategoryStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('lesson')) return 'bg-red-500/20 border-red-500/40 text-red-400';
    if (cat.includes('meal') || cat.includes('lunch') || cat.includes('dinner') || cat.includes('breakfast')) return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-500';
    if (cat.includes('circle')) return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400';
    return 'bg-stone-500/10 border-white/5 text-white/40';
  };

  const getEventBoxStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('lesson')) return 'bg-red-500/[0.03] border-red-500/10 hover:bg-red-500/[0.06] hover:border-red-500/30';
    if (cat.includes('meal') || cat.includes('lunch') || cat.includes('dinner') || cat.includes('breakfast')) return 'bg-yellow-500/[0.03] border-yellow-500/10 hover:bg-yellow-500/[0.06] hover:border-yellow-500/30';
    if (cat.includes('circle')) return 'bg-emerald-500/[0.03] border-emerald-500/10 hover:bg-emerald-500/[0.06] hover:border-emerald-500/30';
    return 'bg-stone-500/[0.03] border-stone-500/10 hover:bg-stone-500/[0.06] hover:border-stone-500/30'; // Brown-ish/Stone
  };

  return (
    <div className={`min-h-screen bg-[#0d0d0f] text-[#f3f3f2] font-sans selection:bg-[#ff533d] selection:text-white`}>
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[120%] h-[50%] bg-radial-gradient from-[#ff533d]/20 to-transparent blur-[120px]" />
      </div>

      {/* Main Container */}

      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0c]/95 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          {/* Header row */}
          <div className="px-4 h-12 flex items-center justify-between border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#ff533d] flex items-center justify-center">
                <span className="font-black text-black text-[10px]">⚔</span>
              </div>
              <h1 className="text-[10px] font-black tracking-widest uppercase truncate text-white/80">Empower Camp</h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setShowInfo(true)}
                className="p-1.5 bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
                title="Information"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Unified Navigation Hub - Cohesive 5-item Layout */}
          <div className="w-[95%] sm:w-[85%] mx-auto p-2">
            <div className="grid grid-cols-5 bg-white/5 backdrop-blur-md rounded-2xl p-1 gap-1 border border-white/10">
              {['day1', 'day2', 'day3'].map((id) => {
                const day = data.find(d => d.id === id);
                const dayNum = id.replace('day', '');
                const dateLabel = day ? day.date : (id === 'day1' ? 'Apr 29' : id === 'day2' ? 'Apr 30' : 'May 1');
                const isActive = activeDayId === id && filter === 'ALL';
                
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveDayId(id);
                      setFilter('ALL');
                    }}
                    className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#ff533d] text-black shadow-lg shadow-[#ff533d]/20' 
                        : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-[8px] sm:text-xs font-black uppercase tracking-tighter sm:tracking-widest ${isActive ? 'text-black/60' : 'text-white/30'}`}>
                      Day {dayNum}
                    </span>
                    <span className="font-black text-xs sm:text-xl leading-none whitespace-nowrap">{dateLabel}</span>
                  </button>
                );
              })}

              <button
                onClick={() => setFilter('LESSON')}
                className={`py-2 px-0.5 rounded-xl text-[10px] sm:text-sm font-black uppercase transition-all flex flex-col items-center justify-center ${
                  filter === 'LESSON'
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'text-red-500/50 hover:bg-red-500/10'
                }`}
              >
                <span className="hidden sm:block text-[8px] opacity-60">View</span>
                Lessons
              </button>

              <button
                onClick={() => setFilter('CIRCLE')}
                className={`py-2 px-0.5 rounded-xl text-[10px] sm:text-sm font-black uppercase transition-all flex flex-col items-center justify-center ${
                  filter === 'CIRCLE'
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'text-emerald-500/50 hover:bg-emerald-500/10'
                }`}
              >
                <span className="hidden sm:block text-[8px] opacity-60">Group</span>
                Circles
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Background Spartan Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-lighten">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: spartanOpacity }}
          className="absolute bottom-0 -right-20 sm:right-0 w-[140%] sm:w-[60%] select-none"
        >
          <img 
            src="/spartan.png" 
            alt="" 
            className="w-full h-auto object-contain object-bottom"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </motion.div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-24">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-black mb-6"
          >
            Empower Camp 2026
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-black tracking-tight leading-[0.85] text-[#ff533d] mb-6 text-center text-7xl sm:text-[12rem] uppercase drop-shadow-2xl"
          >
            Battle <br /> Cry
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 font-medium tracking-widest uppercase text-sm mb-12"
          >
            To Live Christ, To Die Gain
          </motion.p>
        </header>

        {/* Schedule List */}
        <section className="space-y-6">
          <div className="pt-4 border-b border-white/5 pb-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase flex flex-wrap items-center gap-2 sm:gap-3">
                {filter === 'ALL' ? `${activeDay.label} Information` : filter === 'LESSON' ? 'All Camp Lessons' : 'All Empower Circles'}
                <span className="text-[10px] sm:text-xs text-[#ff533d] px-3 py-1 rounded-full bg-[#ff533d]/10 border border-[#ff533d]/20">
                  { (filter === 'ALL' 
                    ? activeDay.events 
                    : data.flatMap(d => d.events.filter(e => {
                        const cat = e.category.toLowerCase();
                        if (filter === 'LESSON') return cat.includes('lesson');
                        if (filter === 'CIRCLE') return cat.includes('circle');
                        return false;
                      }))
                  ).length } Found
                </span>
              </h3>
              {filter === 'ALL' && <p className="text-[#ff533d] font-bold uppercase tracking-widest text-xs tracking-[0.2em]">{activeDay.theme}</p>}
            </div>
          </div>

          <div className="grid gap-4 mt-8">
            {(filter === 'ALL' 
                ? activeDay.events 
                : data.flatMap(day => day.events.filter(event => {
                    const cat = event.category.toLowerCase();
                    if (filter === 'LESSON') return cat.includes('lesson');
                    if (filter === 'CIRCLE') return cat.includes('circle');
                    return false;
                  })).sort((a, b) => {
                    // Sorting by original day first, then by time
                    const dayA = data.find(d => d.events.some(e => e.id === a.id))?.id || '';
                    const dayB = data.find(d => d.events.some(e => e.id === b.id))?.id || '';
                    if (dayA !== dayB) return dayA.localeCompare(dayB);
                    return timeToMinutes(a.start) - timeToMinutes(b.start);
                  })
              ).map((event, idx) => {
                const eventDay = data.find(d => d.events.some(e => e.id === event.id));
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setSelectedEventDayId(eventDay?.id || activeDay.id);
                    }}
                    className={`group cursor-pointer border rounded-3xl p-5 sm:p-7 transition-all duration-200 ${getEventBoxStyles(event.category)}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      {/* Time Box */}
                      <div className="sm:w-32 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-white/10 pb-3 sm:pb-0 sm:pr-6 shrink-0">
                        <div className={`text-lg sm:text-xl font-black ${
                          event.category.toLowerCase().includes('lesson') ? 'text-red-400' :
                          (event.category.toLowerCase().includes('meal') || event.category.toLowerCase().includes('lunch') || event.category.toLowerCase().includes('dinner') || event.category.toLowerCase().includes('breakfast')) ? 'text-yellow-500' :
                          event.category.toLowerCase().includes('circle') ? 'text-emerald-400' :
                          'text-white/90'
                        }`}>{event.start}</div>
                        <div className="text-xs font-bold text-white/30 uppercase">{event.end || '—'}</div>
                        {filter !== 'ALL' && eventDay && (
                          <div className="text-[10px] font-black text-[#ff533d] uppercase mt-1">{eventDay.label}</div>
                        )}
                      </div>

                      {/* Info Box */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-tighter ${getCategoryStyles(event.category)}`}>
                            {event.category}
                          </span>
                        </div>
                        <h4 className={`text-base sm:text-lg font-black tracking-tight mb-2 transition-colors break-words sm:line-clamp-2 ${
                          event.category.toLowerCase().includes('lesson') ? 'text-red-400 group-hover:text-red-300' :
                          (event.category.toLowerCase().includes('meal') || event.category.toLowerCase().includes('lunch') || event.category.toLowerCase().includes('dinner') || event.category.toLowerCase().includes('breakfast')) ? 'text-yellow-500 group-hover:text-yellow-400' :
                          event.category.toLowerCase().includes('circle') ? 'text-emerald-400 group-hover:text-emerald-300' :
                          'text-white/80 group-hover:text-white'
                        }`}>{event.title}</h4>
                        <p className="text-white/40 text-sm line-clamp-1">{event.preview}</p>
                      </div>

                      <div className="flex items-center justify-end sm:pl-4 gap-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-[#ff533d] group-hover:text-black transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedEventId(null);
              }}
              className="absolute inset-0 bg-[#0a0a0c]/98 backdrop-blur-3xl"
            />
            
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="relative w-full h-full sm:h-[85vh] sm:max-w-4xl bg-white text-stone-900 sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <button 
                onClick={() => {
                  setSelectedEventId(null);
                }}
                className="fixed top-4 right-4 z-[200] w-12 h-12 flex items-center justify-center bg-black/5 active:bg-black/10 sm:bg-stone-100 sm:hover:bg-stone-200 rounded-full transition-all active:scale-90 shadow-sm"
              >
                <X className="w-6 h-6 text-stone-900" />
              </button>

              {/* Modal Header Area - Smaller & Compact to save space */}
              <div className="flex-none sm:p-10 border-b border-stone-100 bg-stone-50/50 pt-16 sm:pt-10 p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 px-3 py-0.5 bg-white rounded-full border border-stone-200 text-[9px] font-black uppercase tracking-widest text-stone-400">
                      <Calendar className="w-2.5 h-2.5 text-[#ff533d]" />
                      {selectedEventDayId && data.find(d=>d.id===selectedEventDayId)?.label} • {selectedEventDayId && data.find(d=>d.id===selectedEventDayId)?.date}
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getCategoryStyles(selectedEvent.category)}`}>
                      <Tag className="w-2.5 h-2.5" />
                      {selectedEvent.category}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-4xl font-black tracking-tight leading-[1.1] uppercase text-stone-900 pr-10">
                      {selectedEvent.title}
                    </h2>
                    <div className={`flex items-center gap-1.5 font-black uppercase tracking-[0.1em] text-[10px] sm:text-sm ${
                      selectedEvent.category.toLowerCase().includes('lesson') ? 'text-red-500' :
                      selectedEvent.category.toLowerCase().includes('meal') ? 'text-yellow-600' :
                      'text-emerald-600'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      {selectedEvent.start} {selectedEvent.end !== '—' && `— ${selectedEvent.end}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content Area - MAX READABILITY */}
              <div className="flex-1 p-6 sm:p-12 overflow-y-auto bg-white no-scrollbar scroll-smooth pb-32 sm:pb-24">
                  <div className="max-w-3xl mx-auto space-y-10">
                    {/* Lesson Header Metadata */}
                    {selectedEvent.category.toLowerCase().includes('lesson') && (
                      <div className="grid gap-6">
                        <div className="p-8 rounded-[2.5rem] bg-red-50 border border-red-100/50 space-y-6">
                          <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 mb-1">Speaker</div>
                              <div className="text-2xl font-black text-stone-900 leading-tight">{selectedEvent.speaker || 'No Speaker Set'}</div>
                            </div>
                            <div className="flex-1">
                              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 mb-1">Theme Verse</div>
                              <div className="text-xl font-bold italic text-stone-700 leading-tight">"{selectedEvent.verse || '...'}"</div>
                            </div>
                          </div>
                          <div className="pt-6 border-t border-red-200/30">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 mb-2">Session Goal</div>
                            <p className="text-stone-600 font-medium leading-relaxed">{selectedEvent.goal || 'Goal to be announced.'}</p>
                          </div>
                          {selectedEvent.pptUrl && (
                            <a 
                              href={selectedEvent.pptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg active:scale-95"
                            >
                               <span className="text-base">📥</span>
                              Download Session PPT
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-8">
                      <div className="flex items-center gap-2 text-stone-400 border-b border-stone-100 pb-3">
                        <Info className="w-4 h-4 text-[#ff533d]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Detailed Content</span>
                      </div>
                      
                      <div className="prose prose-stone max-w-none prose-p:text-xl prose-p:leading-relaxed sm:prose-xl prose-p:sm:leading-loose">
                        <div 
                          className="text-stone-800 font-medium editor-view-output"
                          dangerouslySetInnerHTML={{ __html: selectedEvent.details }}
                          onClick={(e) => {
                            const target = e.target as HTMLElement;
                            const verseBtn = target.closest('.verse-btn');
                            if (verseBtn) {
                              const verseRef = verseBtn.getAttribute('data-verse');
                              if (verseRef && BIBLE_VERSES[verseRef]) {
                                setActiveVerse({ ref: verseRef, text: BIBLE_VERSES[verseRef] });
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="p-6 rounded-[2.5rem] bg-stone-50 border border-stone-100 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white border border-stone-100 flex items-center justify-center text-stone-300 shadow-sm shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 mb-0.5">PIC / Facilitator</div>
                        <div className="text-lg font-black text-stone-900 uppercase tracking-tight leading-none">{selectedEvent.poc}</div>
                      </div>
                    </div>
                  </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Information Modal */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className="absolute inset-0 bg-[#0d0d0f]/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#ffffff] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 pb-4 flex justify-between items-center border-b border-stone-100">
                <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tight">Camp Hub</h3>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="p-2 bg-stone-50 rounded-xl text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-12 no-scrollbar">
                {/* Things to Bring */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#ff533d]">
                    <Check className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Things to Bring</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'BIBLE', 'BALLPEN', 'SLIPPERS', 'TOWEL', 'TOILETRIES', 
                      'TUMBLER', 'HYGIENE KIT', 'BLANKET / PILLOW', 
                      'CLOTHES (FOR 3 DAYS)', 'CLOTHES (GAMES)', 'PERSONAL MEDICINE'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 text-stone-900 font-black text-[11px] uppercase tracking-widest border border-stone-100">
                        <div className="w-2 h-2 rounded-full bg-[#ff533d]" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Venue */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#ff533d]">
                    <Type className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
                  </div>
                  <div className="p-5 rounded-3xl bg-stone-50 border border-stone-100">
                    <h4 className="text-lg font-black text-stone-900 mb-2">Emmaus Bible Camp</h4>
                    <p className="text-stone-500 text-sm mb-4 font-bold uppercase">Malolos, Bulacan</p>
                    <a 
                      href="https://www.google.com/maps/place/Emmaus+Bible+Camp/@14.8424352,120.826643,17z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#ff533d] text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                    >
                      Google Maps
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-stone-50 border-t border-stone-100">
                <button
                  onClick={() => setShowInfo(false)}
                  className="w-full bg-black text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[2px]"
                >
                  Close Hub
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Decoration */}
      <footer className="max-w-7xl mx-auto px-4 py-20 text-center border-t border-white/5 mt-20">
        <div className="mb-8 p-12 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff533d] to-transparent" />
          <h3 className="text-sm font-black uppercase tracking-[0.5em] text-[#ff533d] mb-4">Theme Verse</h3>
          <p className="text-xl sm:text-3xl font-black tracking-tight text-white/90 leading-tight mb-2 italic">
            "For to me, to live is Christ and to die is gain."
          </p>
          <p className="text-xs font-black uppercase tracking-widest text-white/40">Philippians 1:21</p>
        </div>

        <div className="mb-4 opacity-20">⚔</div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-12">
          © 2026 EMPOWER CAMP — TO LIVE CHRIST, TO DIE GAIN
        </p>
      </footer>

      <AnimatePresence>
        {activeVerse && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVerse(null)}
              className="absolute inset-0 bg-[#0a0a0c]/90 backdrop-blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 text-stone-900 shadow-2xl border border-white/20"
            >
              <button 
                onClick={() => setActiveVerse(null)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff533d] mb-2 block">Scripture Reading</span>
                <h3 className="text-3xl font-black tracking-tight text-stone-900">{activeVerse.ref}</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">NKJV Edition</span>
              </div>

              <div className="prose prose-stone">
                <p className="text-2xl font-black italic tracking-tight text-stone-800 leading-tight">
                  "{activeVerse.text}"
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-stone-100">
                <button 
                  onClick={() => setActiveVerse(null)}
                  className="w-full bg-stone-900 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-stone-800 transition-all"
                >
                  Close Verse
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

