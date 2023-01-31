package game.services;

import game.models.GridDataModel;
import game.models.Grids;
import game.models.MapModelDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
class GridServiceTest {

    private GridService gridService;

    final Grids initialGrids = new Grids();
    final String path = "./src/main/java/game/test.json";
    int[] gridValues1;
    int[] gridValues2;

    @BeforeEach
    void setUp() {
        gridService = new GridService();
        gridValues1 = new int[] { 0, 0, 9, 0, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 7, 0, 0, 0, 0, 0, 5, 4, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 9, 2, 0, 0 };
        gridValues2 = new int[] { 1, 9, 8, 0, 6, 4, 5, 2, 3, 0, 0, 2, 5, 8, 9, 0, 4, 7, 0, 0, 5, 2, 3, 0, 6, 8, 9, 0, 0,
                6, 0, 0, 8, 2, 0, 5, 0, 5, 9, 0, 4, 2, 0, 1, 8, 2, 8, 1, 3, 7, 5, 9, 6, 4, 8, 2, 4, 9, 5, 6, 0, 0, 1, 5,
                0, 0, 8, 2, 7, 4, 9, 6, 9, 6, 7, 4, 1, 3, 8, 5, 2 };
        final Map<String, Integer> map1 = new HashMap<>();
        map1.put("jean", 14);
        final GridDataModel grid1 = new GridDataModel(1, gridValues1, map1);
        final Map<String, Integer> map2 = new HashMap<>();
        map2.put("hugo", 10);
        final GridDataModel grid2 = new GridDataModel(2, gridValues2, map2);
        final List<GridDataModel> listGrids = new ArrayList<>();
        listGrids.add(grid1);
        listGrids.add(grid2);
        initialGrids.setGrids(listGrids);
    }

    @Test
    void readTextFile() {
        assertEquals(initialGrids, gridService.readTextFile(path));
    }

    @Test
    void readAllGrids() throws Exception {
        final List<MapModelDTO> expectedRes = new ArrayList<>();
        expectedRes.add(new MapModelDTO(1, gridValues1));
        expectedRes.add(new MapModelDTO(2, gridValues2));
        assertEquals(expectedRes, gridService.readAllGrids(path));
    }

    @Test
    void readHighScores() throws IdNotPresentException {
        final Map<String, Integer> expectedRes = new HashMap<>();
        expectedRes.put("jean", 14);
        assertEquals(expectedRes, gridService.readHighScores(1, path));
    }

    @Test
    void readGridData() throws IdNotPresentException {
        final MapModelDTO expectedRes = new MapModelDTO(1, gridValues1);
        assertEquals(expectedRes, gridService.readGridData(1, path));
    }

    @Test
    void getNewId() {
        gridService.readTextFile(path);
        assertEquals(3, gridService.getNewId());
    }

    @Test
    void writeTextFileHigherScore() throws IdNotPresentException {
        gridService.writeTextFile(gridValues1, "jean", 16, path);
        assertEquals(14, gridService.readHighScores(1, path).get("jean"));
        gridService.writeGridsInFile(initialGrids, path);
    }

    @Test
    void writeTextFileLowerScore() throws IdNotPresentException {
        gridService.writeTextFile(gridValues1, "jean", 10, path);
        assertEquals(10, gridService.readHighScores(1, path).get("jean"));
        gridService.writeGridsInFile(initialGrids, path);
    }

    @Test
    void writeTextFileNewPlayer() throws IdNotPresentException {
        gridService.writeTextFile(gridValues1, "victor", 10, path);
        assertEquals(10, gridService.readHighScores(1, path).get("victor"));
        gridService.writeGridsInFile(initialGrids, path);
    }

    @Test
    void writeTextFileNewGrid() throws IdNotPresentException {
        final int[] gridValues3 = new int[] { 5, 0, 9, 0, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 0, 0, 6, 3, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 7, 0, 0, 0, 0, 0, 5, 4,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 9, 2, 0, 0 };
        gridService.writeTextFile(gridValues3, "victor", 10, path);
        assertEquals(10, gridService.readHighScores(3, path).get("victor"));
        gridService.writeGridsInFile(initialGrids, path);
    }

    @Test
    void writeGridsInFileTest() {
        final Grids newGrids = new Grids();
        final Map<String, Integer> map1 = new HashMap<>();
        map1.put("jean", 14);
        final GridDataModel grid1 = new GridDataModel(1, gridValues1, map1);
        final List<GridDataModel> listGrids = new ArrayList<>();
        listGrids.add(grid1);
        newGrids.setGrids(listGrids);
        gridService.writeGridsInFile(newGrids, path);
        assertEquals(newGrids, gridService.readTextFile(path));
        gridService.writeGridsInFile(initialGrids, path);
    }
}