<script setup>
import { ref } from 'vue';

const openCompany = ref(null);
const openIndividual = ref(null);

function toggleCompany(index) {
  openCompany.value = openCompany.value === index ? null : index;
}

function toggleIndividual(index) {
  openIndividual.value = openIndividual.value === index ? null : index;
}

const companyTopics = [
  {
    title: 'Qualification Recognition',
    content: 'Degrees and professional qualifications earned in Germany are generally recognised in Denmark and vice versa, particularly for regulated professions. For some roles — such as healthcare workers, teachers and engineers — formal recognition through the Danish Agency for Higher Education or the German Anabin database may be required before employment can begin. We recommend starting this process early, as it can take several weeks.'
  },
  {
    title: 'Visa and Work Permit Requirements',
    content: 'Citizens of EU and EEA countries can work freely on both sides of the border without a permit. For candidates from outside the EU, Danish and German rules differ significantly. In Denmark, options include the Fast-track Scheme, the Pay Limit Scheme and the Positive List. In Germany, the Fachkräfteeinwanderungsgesetz (Skilled Immigration Act) applies. Both countries require registration with local authorities within the first weeks of arrival.'
  },
  {
    title: 'Labour Law Differences',
    content: 'Danish employment is largely governed by collective agreements rather than statutory law, which means terms vary by sector and union. German labour law is more codified, with stronger statutory protections around dismissal, notice periods and works councils. If you employ someone in Denmark but they commute from Germany, Danish rules apply. Cross-border postings have their own rules — we recommend seeking legal advice before making your first cross-border hire.'
  },
  {
    title: 'Integration',
    content: 'Bringing someone across the border is not just a legal process — it is a cultural one. Language can be a real barrier, particularly in smaller companies where Danish or German is the working language. Consider offering language support, a buddy system, or connections to local expat communities. The border region has a long history of cross-border life and there are many organisations that support integration for both companies and newcomers.'
  }
];

const individualTopics = [
  {
    title: 'Visa and Registration Requirements',
    content: 'If you are an EU or EEA citizen, you have the right to live and work anywhere in the union. Moving to Denmark requires registering with the local municipality (folkeregister) within five days of arrival if you plan to stay more than three months. You will need a CPR number to access public services, open a bank account and pay taxes. If you live in Germany and work in Denmark, you are a cross-border commuter (grænsearbejder) and must register in both countries.'
  },
  {
    title: 'Taxation for Cross-Border Workers',
    content: 'Cross-border workers are subject to special tax arrangements under Nordic conventions. If you live in Germany and work in Denmark, you generally pay tax in Denmark — but there are provisions to avoid double taxation. Your situation depends on how many days you work in each country. We strongly recommend consulting a cross-border tax adviser before you start, as the rules are specific and errors are costly.'
  },
  {
    title: 'Practical Life',
    content: 'Housing on the German side of the border is generally more affordable than in Denmark, which is why many people choose to live in Schleswig-Holstein and commute. You will need to register with your local Einwohnermeldeamt, set up a bank account, and sort out health insurance. The Danish healthcare system (sygesikring) also covers cross-border workers employed in Denmark. Public transport connections between Flensburg and southern Denmark are steadily improving.'
  },
  {
    title: 'Language and Social Integration',
    content: 'German and Danish are both spoken in the border region and many locals have a working knowledge of both. Getting by in everyday life is easier with at least basic Danish if you work in Denmark, or German if you are based in Schleswig-Holstein. Language courses are widely available on both sides — Studieskolen and VUC offer Danish courses in the region, and Volkshochschulen provide German. The region has a rich shared cultural life including festivals, sports clubs, and a long minority tradition on both sides of the border.'
  }
];
</script>

<template>

  <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
    <div class="col-span-12">
      <h1 class="text-white mb-4 md:mb-6 text-3xl md:text-5xl">
        Border Region Info: Cross-Border Life Between Denmark and Germany
      </h1>
    </div>
    <div class="col-span-12 md:col-span-9">
      <p class="text-white text-lg md:text-2xl lg:text-3xl font-bold leading-9">
        Practical information for companies hiring across the border and individuals considering a move.
      </p>
    </div>
  </section>

  <div class="basegrid py-12">

    <div class="col-span-12 lg:col-span-8">

      <h2 class="text-dark-blue font-bold mb-3">Introduction</h2>
      <p class="text-gray-700 mb-4">
        The German-Danish border region is one of Europe's most active cross-border labour markets. Companies on both sides regularly hire across the border, and thousands of people already live in one country and work in the other.
      </p>
      <p class="text-gray-700 mb-12">
        This page gives you the practical information you need — whether you are a company looking to hire or a professional considering a move.
      </p>

      <h2 class="text-dark-blue font-bold mb-3">For companies</h2>
      <p class="text-gray-700 mb-6">
        Recruiting across the German-Danish border gives you access to a significantly larger talent pool — but it comes with a different set of legal requirements, administrative procedures and cultural considerations than hiring domestically. This section walks you through finding candidates, understanding the legal framework, and making sure the people you hire actually stay.
      </p>

      <div class="flex flex-col gap-3 mb-12">
        <div v-for="(item, index) in companyTopics" :key="item.title">
          <button
            @click="toggleCompany(index)"
            class="w-full flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-dark-blue font-medium px-5 py-4 rounded-lg transition-colors text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              :class="openCompany === index ? 'rotate-180' : ''"
              class="transition-transform duration-200 shrink-0">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ item.title }}
          </button>
          <div v-if="openCompany === index" class="bg-gray-50 px-5 py-4 rounded-b-lg border border-t-0 border-gray-200">
            <p class="text-gray-700">{{ item.content }}</p>
          </div>
        </div>
      </div>

      <h2 class="text-dark-blue font-bold mb-3">For individuals</h2>
      <p class="text-gray-700 mb-6">
        The border region between Southern Denmark and Schleswig-Holstein is genuinely international — people cross the border to work every day, and the region has a long history of cooperation between the two sides. If you are considering a move, the process involves registration, some paperwork and possibly getting your qualifications recognised. It is very doable. This section tells you what to expect, step by step.
      </p>

      <div class="flex flex-col gap-3">
        <div v-for="(item, index) in individualTopics" :key="item.title">
          <button
            @click="toggleIndividual(index)"
            class="w-full flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-dark-blue font-medium px-5 py-4 rounded-lg transition-colors text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              :class="openIndividual === index ? 'rotate-180' : ''"
              class="transition-transform duration-200 shrink-0">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ item.title }}
          </button>
          <div v-if="openIndividual === index" class="bg-gray-50 px-5 py-4 rounded-b-lg border border-t-0 border-gray-200">
            <p class="text-gray-700">{{ item.content }}</p>
          </div>
        </div>
      </div>

    </div>

  </div>

</template>
