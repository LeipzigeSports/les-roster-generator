<script setup lang="ts">
const props = defineProps<{
  show: boolean
}>()
const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="show" class="help-modal" @click.self="emit('close')">
    <div class="help-content overflow-y-auto max-h-[85vh]">
      <h2 class="bold text-4xl mb-6" style="color: #ff6700; font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">Datenschutzerklärung</h2>
      
      <div class="space-y-8 text-lg leading-relaxed">
        <section>
          <h3 class="bold text-xl mb-3" style="color: #ff6700">1. Verantwortliche Stelle</h3>
          <p>Leipzig eSports e. V.<br>
          E-Mail: <a href="mailto:kontakt@leipzigesports.de" class="hover:underline" style="color: #ff6700">kontakt@leipzigesports.de</a><br>
          Website: <a href="https://leipzigesports.de" target="_blank" class="hover:underline" style="color: #ff6700">leipzigesports.de</a></p>
        </section>

        <section>
          <h3 class="bold text-xl mb-3" style="color: #ff6700">2. Bereitstellung des Webtools</h3>
          <p>Bei der Nutzung dieses Tools werden technisch bedingt Informationen von Ihrem Browser an unseren Hoster sowie an die unten genannten Drittanbieter übermittelt (insbesondere Ihre IP-Adresse, Browsertyp und Uhrzeit). Diese Übermittlung ist notwendig, um die Funktionen des Tools (Laden von Heldenbildern, Export der Grafik) bereitzustellen.</p>
        </section>

        <section>
          <h3 class="bold text-xl mb-3" style="color: #ff6700">3. Einbindung von Drittanbietern & Datenübertragung</h3>
          <p>Zur Darstellung der Helden-Daten und zur technischen Erstellung des Bild-Exports nutzen wir externe Schnittstellen. Dabei wird Ihre IP-Adresse an folgende Anbieter übertragen:</p>
          <ul class="list-disc pl-6 mt-3 space-y-3">
            <li><strong>Overfast API:</strong> Zum Abruf aktueller Overwatch-Helden-Informationen und Spieldaten.</li>
            <li><strong>Blizzard Entertainment, Inc.:</strong> Zum Laden der offiziellen Overwatch-Helden-Porträts und Rollen-Icons.</li>
            <li><strong>Riot Games (Data Dragon API):</strong> Zum Abruf von League of Legends Champion-Informationen und Porträts.</li>
            <li><strong>Images.weserv.nl:</strong> Dieser Bild-Proxy wird genutzt, um die externen Grafiken (Overwatch & LoL) technisch für den lokalen Download als PNG-Datei aufzubereiten.</li>
          </ul>
          <p class="mt-4 italic" style="opacity: 0.8">Rechtsgrundlage: Die Verarbeitung erfolgt auf Grundlage unseres berechtigten Interesses an einer funktionalen und ansprechenden Bereitstellung unseres Community-Angebots gemäß Art. 6 Abs. 1 lit. f DSGVO.</p>
        </section>

        <section>
          <h3 class="bold text-xl mb-3" style="color: #ff6700">4. Lokale Speicherung (Auto-Save)</h3>
          <p>Dieses Tool arbeitet rein clientseitig. Das bedeutet:</p>
          <ul class="list-disc pl-6 mt-2 space-y-2">
            <li>Es werden keine Tracking- oder Marketing-Cookies gesetzt.</li>
            <li>Dieses Tool speichert deine aktuellen Eingaben (Teamname, Spieler, Helden) <strong>ausschließlich lokal in deinem Webbrowser</strong> (localStorage), um Datenverlust beim versehentlichen Neuladen der Seite zu verhindern.</li>
            <li>Diese Daten verbleiben auf deinem Gerät und werden zu keinem Zeitpunkt an unsere Server oder Dritte übertragen. Einen "Cookie-Banner" benötigen wir für diese rein technisch-notwendige Funktion nicht.</li>
          </ul>
        </section>

        <section>
          <h3 class="bold text-xl mb-3" style="color: #ff6700">5. Ihre Rechte</h3>
          <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO. Da wir keine Daten dauerhaft speichern, endet die Verarbeitung mit Ihrer Sitzung.</p>
        </section>

        <section class="border-t border-white/10 pt-6">
          <h3 class="bold text-xl mb-3" style="color: #ff6700">6. Ergänzende Hinweise</h3>
          <p>Dieses Tool ist ein inoffizielles Community-Projekt. Overwatch und alle zugehörigen Assets sind Eigentum von Blizzard Entertainment. League of Legends und alle zugehörigen Assets sind Eigentum von Riot Games. Für die allgemeine Datenverarbeitung des Vereins gilt zudem die Datenschutzerklärung unserer Hauptseite: <a href="https://leipzigesports.de/datenschutz" target="_blank" class="hover:underline" style="color: #ff6700">leipzigesports.de/datenschutz</a>.</p>
        </section>
      </div>

      <div class="mt-10 flex justify-center mr-2">
        <button @click="emit('close')" class="flex px-10 py-3 rounded text-xl cursor-pointer">VERSTANDEN</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar-Styling für einen besseren Look */
.help-content::-webkit-scrollbar {
  width: 8px;
}
.help-content::-webkit-scrollbar-track {
  background: #151515;
}
.help-content::-webkit-scrollbar-thumb {
  background: #ff6700;
  border-radius: 4px;
}
</style>
