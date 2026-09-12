import React, { useState } from 'react';
import { ApiEndpointDoc, Language } from '../types';
import { translations } from '../services/localization';
import {
  WAR_ERA_API_ENDPOINTS,
  DATA_GAPS_AND_UNKNOWNS,
  WAR_ERA_ECO_SIMULATOR_SPEC
} from '../services/apiCatalogue';
import { Badge } from '../components/Badge';
import {
  BookOpen,
  Server,
  Code,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Terminal,
  Cpu,
  Layers,
  Database
} from 'lucide-react';

interface ApiDiscoveryViewProps {
  language: Language;
}

export const ApiDiscoveryView: React.FC<ApiDiscoveryViewProps> = ({ language }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(WAR_ERA_API_ENDPOINTS[0].id);
  const [activeCodeTab, setActiveCodeTab] = useState<'ts' | 'python' | 'curl'>('ts');
  const t = translations[language];

  const categories = ['All', 'User', 'Battles', 'Market', 'Military Unit', 'Country'];

  const filteredEndpoints = WAR_ERA_API_ENDPOINTS.filter((ep) => {
    if (selectedCategory === 'All') return true;
    return ep.category === selectedCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#f4f4f2]">
          {t.apiTitle}
        </h2>
        <p className="text-xs md:text-sm text-[#8e929b] mt-0.5">
          {t.apiSubtitle}
        </p>
      </div>

      {/* Official Architecture & Gateway Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 bg-[#181a1f] border border-[#3ba776]/30 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#3ba776] font-semibold uppercase mb-1">
            <Server className="w-3.5 h-3.5" />
            <span>War Era Gateway (Hattorius)</span>
          </div>
          <div className="text-sm font-mono text-[#f4f4f2] mb-1">gateway.warerastats.io/trpc</div>
          <p className="text-xs text-[#8e929b]">
            Open-source caching proxy with 400ms request batching and PostgreSQL persistence for high-frequency queries.
          </p>
          <div className="mt-2 text-[11px] text-[#c5a059] flex items-center gap-1 font-mono">
            github.com/Hattorius/War-Era-Gateway
          </div>
        </div>

        <div className="p-4 bg-[#181a1f] border border-[#2c303a] rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#8e929b] font-semibold uppercase mb-1">
            <Cpu className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Official War Era tRPC API</span>
          </div>
          <div className="text-sm font-mono text-[#f4f4f2] mb-1">api2.warera.io/trpc</div>
          <p className="text-xs text-[#8e929b]">
            Direct game server procedure router. All queries executed as HTTP GET with JSON-encoded batch query parameters.
          </p>
          <div className="mt-2 text-[11px] text-[#8e929b]">
            Docs: api2.warera.io/docs
          </div>
        </div>

        <div className="p-4 bg-[#181a1f] border border-[#2c303a] rounded-xl">
          <div className="flex items-center gap-2 text-xs text-[#8e929b] font-semibold uppercase mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#4a88c9]" />
            <span>Community API Docs (Majima)</span>
          </div>
          <div className="text-sm font-mono text-[#f4f4f2] mb-1">majimawrks/warera-api-docs</div>
          <p className="text-xs text-[#8e929b]">
            Community network trace documentation covering 23 core endpoints across user, battle, and market systems.
          </p>
          <div className="mt-2 text-[11px] text-[#4a88c9]">
            majimawrks.github.io/warera-api-docs
          </div>
        </div>
      </div>

      {/* Code Integration Examples (TypeScript tRPC & Python pywarera) */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[#c5a059]" />
            <h3 className="text-sm font-semibold text-[#f4f4f2]">
              Client Integration Standards (WarEraProjects)
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-[#111215] p-1 rounded-lg border border-[#23262f] text-xs">
            <button
              type="button"
              onClick={() => setActiveCodeTab('ts')}
              className={`px-2.5 py-1 rounded cursor-pointer ${
                activeCodeTab === 'ts' ? 'bg-[#22252c] text-[#c5a059] font-medium' : 'text-[#8e929b]'
              }`}
            >
              TypeScript (tRPC)
            </button>
            <button
              type="button"
              onClick={() => setActiveCodeTab('python')}
              className={`px-2.5 py-1 rounded cursor-pointer ${
                activeCodeTab === 'python' ? 'bg-[#22252c] text-[#c5a059] font-medium' : 'text-[#8e929b]'
              }`}
            >
              Python (pywarera)
            </button>
            <button
              type="button"
              onClick={() => setActiveCodeTab('curl')}
              className={`px-2.5 py-1 rounded cursor-pointer ${
                activeCodeTab === 'curl' ? 'bg-[#22252c] text-[#c5a059] font-medium' : 'text-[#8e929b]'
              }`}
            >
              cURL (Gateway)
            </button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#111215] border border-[#23262f] font-mono text-xs text-[#d4d6db] overflow-x-auto">
          {activeCodeTab === 'ts' && (
            <pre>{`// TypeScript tRPC Client (WarEraProjects Standard)
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './warera-router-types';

export const wareraGateway = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'https://gateway.warerastats.io/trpc',
      maxURLLength: 2083,
    }),
  ],
});

// Fetch user profile without authentication
const player = await wareraGateway.user.getUserLite.query({ username: 'MOUHAB' });
console.log('Player Level:', player.level, 'MU:', player.militaryUnitName);`}</pre>
          )}

          {activeCodeTab === 'python' && (
            <pre>{`# Python Client (pywarera by Marerjh)
from pywarera import WarEraClient

client = WarEraClient(base_url="https://gateway.warerastats.io/trpc")

# Query active battle ranking
ranking = client.get_battle_ranking(battle_id="bat_7811", side="attacker")
for hero in ranking.top_hitters:
    print(f"{hero.rank}. {hero.username} - {hero.total_damage} DMG")`}</pre>
          )}

          {activeCodeTab === 'curl' && (
            <pre>{`# Direct GET query to War Era Gateway
curl -X GET "https://gateway.warerastats.io/trpc/user.getUserLite?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22username%22%3A%22MOUHAB%22%7D%7D%7D" \\
     -H "Accept: application/json"`}</pre>
          )}
        </div>
      </div>

      {/* Endpoint Catalogue */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#f4f4f2]">Verified Endpoint Catalogue</h3>
            <span className="text-xs text-[#8e929b]">Official WarEra procedures and request/response contracts</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#22252c] text-[#c5a059] border border-[#c5a059]/30'
                    : 'text-[#8e929b] hover:bg-[#111215]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Endpoints Accordion */}
        <div className="space-y-3">
          {filteredEndpoints.map((ep) => {
            const isExpanded = expandedEndpoint === ep.id;
            return (
              <div
                key={ep.id}
                className="border border-[#2c303a] rounded-xl bg-[#111215] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedEndpoint(isExpanded ? null : ep.id)}
                  className="w-full p-4 flex items-center justify-between text-start cursor-pointer hover:bg-[#181a1f] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#22252c] text-[#3ba776] border border-[#3ba776]/30">
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#f4f4f2]">
                      {ep.path}
                    </span>
                    <span className="text-[10px] text-[#8e929b] hidden sm:inline">
                      ({ep.category})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ep.gatewayCached && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#22252c] text-[#c5a059] border border-[#c5a059]/30 hidden sm:inline">
                        Cache: {ep.cacheTtlSeconds}s
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#8e929b]" /> : <ChevronDown className="w-4 h-4 text-[#8e929b]" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-[#23262f] bg-[#141519] space-y-4 text-xs">
                    <p className="text-[#d4d6db]">{ep.description}</p>

                    {/* Parameters */}
                    <div>
                      <div className="font-semibold text-[#c5a059] mb-1.5">Parameters:</div>
                      <div className="space-y-1">
                        {ep.parameters.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-[#f4f4f2]">{p.name}</span>
                            <span className="text-[#8e929b]">({p.type})</span>
                            <span className="text-[#d99b38]">{p.required ? 'required' : 'optional'}</span>
                            <span className="text-[#8e929b] font-sans">— {p.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Response Fields with Verification Status */}
                    <div>
                      <div className="font-semibold text-[#c5a059] mb-1.5">Response Schema & Reliability:</div>
                      <div className="space-y-1">
                        {ep.responseFields.map((rf, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <span className="font-mono text-[#f4f4f2]">{rf.field}</span>
                            <span className="font-mono text-[#8e929b]">({rf.type})</span>
                            <Badge
                              variant={rf.verified === 'Verified' ? 'emerald' : rf.verified === 'Partially documented' ? 'amber' : 'red'}
                              size="sm"
                            >
                              {rf.verified}
                            </Badge>
                            <span className="text-[#8e929b]">— {rf.notes}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Example Response */}
                    <div>
                      <div className="font-semibold text-[#c5a059] mb-1.5">Verified Example Response:</div>
                      <pre className="p-3 bg-[#111215] rounded-lg border border-[#23262f] text-[11px] font-mono text-[#3ba776] overflow-x-auto">
                        {ep.exampleResponse}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mechanics Map: Data Gaps & Verified Truth */}
      <div className="bg-[#181a1f] border border-[#2c303a] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-[#c5a059]" />
          <h3 className="text-sm font-semibold text-[#f4f4f2]">
            Data Reliability Map & Known Gaps (AI Dev Rules 1 & 2)
          </h3>
        </div>
        <p className="text-xs text-[#8e929b] mb-4">
          In strict compliance with QASWARA Rule 1 (Never invent mechanics) and Rule 2 (Never guess), these gaps are formally documented and safeguarded.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DATA_GAPS_AND_UNKNOWNS.map((gap, idx) => (
            <div key={idx} className="p-3.5 bg-[#111215] rounded-xl border border-[#23262f]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-[#f4f4f2]">{gap.topic}</span>
                <Badge variant={gap.status === 'Verified' ? 'emerald' : 'amber'} size="sm">
                  {gap.status}
                </Badge>
              </div>
              <p className="text-xs text-[#8e929b] mb-2">{gap.finding}</p>
              <div className="text-[11px] text-[#c5a059] font-medium border-t border-[#23262f] pt-1.5">
                QASWARA Policy: {gap.qaswaraGuideline}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
